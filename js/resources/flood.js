import {
  fetchJson,
  bindForm,
  setStatus,
  geocode,
  escapeHtml,
  specRow,
  personalIntakeUrl,
} from "./core.js";

const FEMA_QUERY =
  "/query?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF,STATIC_BFE&returnGeometry=false&f=json";

const FEMA_ENDPOINTS = [
  "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28",
  "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28",
];

function classify(attrs) {
  const zone = String((attrs && attrs.FLD_ZONE) || "—").toUpperCase().replace(/AREA\s+/g, "");
  const sub = String((attrs && attrs.ZONE_SUBTY) || "");
  const sfha = String((attrs && attrs.SFHA_TF) || "").toUpperCase() === "T";
  const bfe = attrs && attrs.STATIC_BFE != null && attrs.STATIC_BFE !== 9999 ? attrs.STATIC_BFE : "";
  const high = sfha || /^(A|AE|AH|AO|AR|A99|V|VE)(\b|$)/.test(zone);
  const coastal = /^V/.test(zone);
  const moderate = !high && (/0\.2|500|SHADED/i.test(sub) || (zone === "X" && /0\.2/i.test(sub)));
  let level = "standard";
  let headline = "Standard / lower mapped flood risk";
  let detail =
    "This point is not in a Special Flood Hazard Area on the effective NFHL. Homeowners still usually excludes flood. A separate flood policy is how you cover rising water.";
  if (high && coastal) {
    level = "high";
    headline = "High-risk coastal flood zone";
    detail =
      "Zone " +
      zone +
      " is a coastal Special Flood Hazard Area. Flood coverage is typically required for a federally backed mortgage, and wave velocity matters.";
  } else if (high) {
    level = "high";
    headline = "High-risk flood zone";
    detail =
      "Zone " +
      zone +
      " is a Special Flood Hazard Area. Flood coverage is typically required for a federally backed mortgage. It is a separate policy from homeowners.";
  } else if (moderate) {
    level = "moderate";
    headline = "Moderate flood risk (shaded Zone X)";
    detail =
      "Mapped as a 0.2% annual-chance area. Flood insurance is usually optional — and often still worth pricing. A large share of claims happen outside the high-risk lines.";
  }
  return { zone, sub, sfha, bfe, level, headline, detail };
}

async function queryNfhl(lon, lat) {
  const geom = "&geometry=" + lon.toFixed(6) + "," + lat.toFixed(6);
  let lastError;
  for (let i = 0; i < FEMA_ENDPOINTS.length; i += 1) {
    try {
      const data = await fetchJson(FEMA_ENDPOINTS[i] + FEMA_QUERY + geom);
      const feats = data.features || [];
      if (feats.length) return feats[0].attributes || feats[0].properties || {};
      if (data.error) throw new Error(data.error.message || "FEMA error");
    } catch (err) {
      lastError = err;
    }
  }
  if (lastError) throw lastError;
  return null;
}

export function initFlood() {
  const form = document.getElementById("flood-form");
  const out = document.getElementById("flood-result");
  const status = document.getElementById("flood-status");
  if (!form) return;

  bindForm(form, async function () {
    const address = form.querySelector("[name='address']").value;
    if (!String(address || "").trim()) {
      setStatus(status, "Enter a street address or ZIP.", "error");
      return;
    }
    setStatus(status, "Looking up the FEMA flood zone…");
    out.hidden = true;
    try {
      const place = await geocode(address);
      const attrs = await queryNfhl(place.lon, place.lat);
      const info = classify(attrs);
      const quote = personalIntakeUrl({
        coverage: "Flood Insurance",
        product: "flood-insurance",
        property_address: place.label,
        zip: place.zip || "",
      });
      const pillClass = info.level === "high" ? "is-on" : info.level === "moderate" ? "is-mid" : "is-off";
      out.innerHTML =
        "<article class='result-card flood-card'>" +
        "<p class='card-tag'>Flood zone status</p>" +
        "<h3>" +
        escapeHtml(info.headline) +
        "</h3>" +
        "<p>" +
        escapeHtml(place.label) +
        "</p>" +
        "<div class='risk-pills'>" +
        "<span class='risk-pill " +
        pillClass +
        "'>Zone " +
        escapeHtml(info.zone) +
        "</span>" +
        "<span class='risk-pill " +
        (info.sfha ? "is-on" : "is-off") +
        "'>" +
        (info.sfha ? "Special Flood Hazard Area" : "Not mapped as SFHA") +
        "</span>" +
        "</div>" +
        "<dl class='spec-list'>" +
        specRow("FEMA flood zone", escapeHtml(info.zone)) +
        specRow("Subtype", escapeHtml(info.sub || "—")) +
        specRow("Base flood elevation", info.bfe !== "" && info.bfe != null ? escapeHtml(String(info.bfe)) : "—") +
        "</dl>" +
        "<p>" +
        escapeHtml(info.detail) +
        "</p>" +
        (place.centroid
          ? "<p class='form-note'>This used a ZIP centroid. For a tighter read, enter a street address.</p>"
          : "") +
        "<p class='disclaimer'>This is an NFHL point lookup, not a formal flood determination or a quote. Maps are updated. A lender may still require coverage.</p>" +
        "<a class='btn btn-gold' href='" +
        quote +
        "'>Request a flood quote</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Zone from the FEMA National Flood Hazard Layer.", "live");
    } catch (err) {
      out.innerHTML =
        "<article class='result-card is-fallback'>" +
        "<p class='card-tag'>Flood zone status</p>" +
        "<h3>We could not read a FEMA zone for that point.</h3>" +
        "<p>The map service did not return a zone. That is not a clean bill of health — flood is still usually excluded from homeowners. Send the address and we will price flood coverage.</p>" +
        "<a class='btn btn-gold' href='" +
        personalIntakeUrl({ coverage: "Flood Insurance", product: "flood-insurance", property_address: address }) +
        "'>Request a flood quote</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Could not map that location. Try a full street address.", "error");
    }
  });
}
