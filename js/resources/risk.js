import { fetchJson, bindForm, setStatus, inquireUrl } from "./core.js";

function nwsHeaders() {
  return { Accept: "application/geo+json" };
}

async function geocode(query) {
  const trimmed = String(query || "").trim();
  const zip = trimmed.match(/\b(\d{5})(?:-\d{4})?\b/);
  if (/^\d{5}$/.test(trimmed) || (zip && trimmed.length <= 10)) {
    const code = (trimmed.match(/^\d{5}/) || zip)[0].slice(0, 5);
    const data = await fetchJson("https://api.zippopotam.us/us/" + code);
    const place = data.places && data.places[0];
    if (!place) throw new Error("ZIP not found");
    return {
      lat: Number(place.latitude),
      lon: Number(place.longitude),
      label: place["place name"] + ", " + place["state abbreviation"] + " " + code,
      zip: code,
    };
  }
  const url =
    "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=" +
    encodeURIComponent(trimmed) +
    "&benchmark=Public_AR_Current&format=json";
  const data = await fetchJson(url);
  const match = data.result && data.result.addressMatches && data.result.addressMatches[0];
  if (!match) throw new Error("Address not found");
  return {
    lat: match.coordinates.y,
    lon: match.coordinates.x,
    label: match.matchedAddress,
    zip: (match.addressComponents && match.addressComponents.zip) || "",
  };
}

function tagFromAlerts(alerts) {
  const text = alerts
    .map(function (a) {
      return ((a.properties && a.properties.event) || "") + " " + ((a.properties && a.properties.headline) || "");
    })
    .join(" ")
    .toLowerCase();
  return {
    flood: /flood|flash flood|coastal flood|storm surge/.test(text),
    wind: /wind|hurricane|tropical|tornado|typhoon/.test(text),
    winter: /winter|ice|blizzard|freeze/.test(text),
    heat: /heat|excessive heat|red flag/.test(text),
  };
}

function seismicLevel(quakes) {
  const maxMag = quakes.reduce(function (max, f) {
    const mag = f.properties && f.properties.mag;
    return mag > max ? mag : max;
  }, 0);
  if (maxMag >= 6) return { label: "Higher", note: "A magnitude 6+ event has been recorded within 100 miles." };
  if (maxMag >= 5) return { label: "Moderate", note: "A magnitude 5+ event has been recorded within 100 miles." };
  if (quakes.length >= 3) return { label: "Watch", note: "Several magnitude 3.5+ events within 100 miles since 1980." };
  if (quakes.length) return { label: "Lower", note: "Limited recorded seismic activity nearby. Not a guarantee of low risk." };
  return { label: "Lower", note: "No magnitude 3.5+ events within 100 miles in USGS records since 1980." };
}

function pill(label, on, onText, offText) {
  return (
    '<span class="risk-pill ' +
    (on ? "is-on" : "is-off") +
    '">' +
    label +
    ": " +
    (on ? onText : offText) +
    "</span>"
  );
}

export function initRisk() {
  const form = document.getElementById("risk-form");
  const out = document.getElementById("risk-result");
  const status = document.getElementById("risk-status");
  bindForm(form, async function () {
    const query = form.querySelector("[name='location']").value;
    setStatus(status, "Checking alerts and seismic history…");
    out.hidden = true;
    try {
      const place = await geocode(query);
      const alertsUrl =
        "https://api.weather.gov/alerts/active?point=" + place.lat.toFixed(4) + "," + place.lon.toFixed(4);
      let alerts = [];
      try {
        const alertData = await fetchJson(alertsUrl, { headers: nwsHeaders() });
        alerts = (alertData.features || []).slice(0, 8);
      } catch (err) {
        alerts = [];
      }
      let quakes = [];
      try {
        const quakeUrl =
          "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=" +
          place.lat +
          "&longitude=" +
          place.lon +
          "&maxradiuskm=160&starttime=1980-01-01&minmagnitude=3.5&orderby=magnitude&limit=10";
        const quakeData = await fetchJson(quakeUrl);
        quakes = quakeData.features || [];
      } catch (err) {
        quakes = [];
      }
      const wx = tagFromAlerts(alerts);
      const seismic = seismicLevel(quakes);
      const alertList = alerts.length
        ? "<ul class='feature-list'>" +
          alerts
            .map(function (a) {
              const p = a.properties || {};
              return "<li>" + (p.event || "Alert") + (p.headline ? " — " + p.headline : "") + "</li>";
            })
            .join("") +
          "</ul>"
        : "<p>No active NWS watches or warnings at this point right now.</p>";
      const inquire = inquireUrl({
        product: "homeowners-insurance",
        need: "insurance",
        location: place.label,
        zip: place.zip || "",
      });
      out.innerHTML =
        "<article class='result-card'>" +
        "<p class='card-tag'>Local risk profile</p>" +
        "<h3>" +
        place.label +
        "</h3>" +
        "<div class='risk-pills'>" +
        pill("Flood / water", wx.flood, "Active alert", "No active NWS flood alert") +
        pill("Wind", wx.wind, "Active alert", "No active NWS wind alert") +
        pill("Seismic", seismic.label !== "Lower", seismic.label, seismic.label) +
        "</div>" +
        "<p>" +
        seismic.note +
        "</p>" +
        "<p class='card-tag'>Active National Weather Service alerts</p>" +
        alertList +
        "<p class='disclaimer'>This is not a FEMA flood-zone determination, a catastrophe model, or a quote. Alerts change. Seismic history is not a forecast.</p>" +
        "<a class='btn btn-gold' href='" +
        inquire +
        "'>Request a full insurance review</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Updated from NWS and USGS.", "live");
    } catch (err) {
      out.innerHTML =
        "<article class='result-card is-fallback'>" +
        "<p class='card-tag'>Fallback profile</p>" +
        "<h3>We could not map that location live.</h3>" +
        "<p>The weather or geocoding service did not respond. Standard homeowners still usually excludes flood. Wind deductibles and earthquake coverage are separate conversations.</p>" +
        "<div class='risk-pills'>" +
        pill("Flood / water", true, "Often excluded", "") +
        pill("Wind", true, "Review deductibles", "") +
        pill("Seismic", false, "", "Needs a local file") +
        "</div>" +
        "<a class='btn btn-gold' href='" +
        inquireUrl({ product: "flood-insurance", need: "insurance" }) +
        "'>Request a full insurance review</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Could not map that location. Try a 5-digit ZIP.", "error");
    }
  });
}
