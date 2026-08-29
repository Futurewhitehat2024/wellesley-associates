import { fetchJson, bindForm, setStatus, inquireUrl } from "./core.js";

const FIELDS = [
  ["Model Year", "year"],
  ["Make", "make"],
  ["Model", "model"],
  ["Body Class", "body"],
  ["Vehicle Type", "type"],
  ["Drive Type", "drive"],
  ["Fuel Type - Primary", "fuel"],
  ["Displacement (L)", "displacement"],
];

function cleanVin(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, "")
    .slice(0, 17);
}

function resultMap(results) {
  const map = {};
  (results || []).forEach(function (row) {
    if (row.Variable) map[row.Variable] = row.Value && row.Value !== "Not Applicable" ? row.Value : "";
  });
  return map;
}

function isCommercial(type) {
  return /truck|bus|trailer|incomplete|motorcycle.*off/i.test(type || "");
}

function storeVin(payload) {
  try {
    sessionStorage.setItem("wellesleyVin", JSON.stringify(payload));
  } catch (err) {}
}

export function initVin() {
  const form = document.getElementById("vin-form");
  const input = form && form.querySelector("[name='vin']");
  const out = document.getElementById("vin-result");
  const status = document.getElementById("vin-status");

  async function run() {
    const vin = cleanVin(input.value);
    input.value = vin;
    if (vin.length !== 17) {
      setStatus(status, "A VIN is 17 characters. Letters I, O, and Q are not used.", "error");
      return;
    }
    setStatus(status, "Decoding VIN…");
    out.hidden = true;
    try {
      const data = await fetchJson("https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" + vin + "?format=json");
      const map = resultMap(data.Results);
      const decoded = Boolean(map["Make"] && map["Model Year"]);
      const error = !decoded && map["Error Text"] ? map["Error Text"] : "";
      const specs = FIELDS.map(function (pair) {
        return { label: pair[0], key: pair[1], value: map[pair[0]] || "—" };
      });
      const payload = {
        vin: vin,
        year: map["Model Year"] || "",
        make: map["Make"] || "",
        model: map["Model"] || "",
        body: map["Body Class"] || "",
        type: map["Vehicle Type"] || "",
        drive: map["Drive Type"] || "",
        fuel: map["Fuel Type - Primary"] || "",
        displacement: map["Displacement (L)"] || "",
      };
      storeVin(payload);
      const commercial = isCommercial(payload.type);
      const product = commercial ? "commercial-auto" : "auto-insurance";
      const qs = inquireUrl({
        product: product,
        need: "insurance",
        vin: vin,
        year: payload.year,
        make: payload.make,
        model: payload.model,
        vehicle: [payload.year, payload.make, payload.model].filter(Boolean).join(" "),
      });
      out.innerHTML =
        "<article class='result-card'>" +
        "<p class='card-tag'>NHTSA VPIC decode</p>" +
        "<h3>" +
        [payload.year, payload.make, payload.model].filter(Boolean).join(" ") +
        "</h3>" +
        (error ? "<p class='form-note is-error'>" + error + "</p>" : "") +
        "<dl class='spec-list'>" +
        specs
          .map(function (row) {
            return "<div><dt>" + row.label + "</dt><dd>" + (row.value || "—") + "</dd></div>";
          })
          .join("") +
        "</dl>" +
        "<p>This decode is from NHTSA. It does not bind coverage or confirm how the vehicle is used.</p>" +
        "<a class='btn btn-gold' href='" +
        qs +
        "'>Request a " +
        (commercial ? "commercial auto" : "personal auto") +
        " quote</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Decoded from NHTSA VPIC.", "live");
    } catch (err) {
      out.innerHTML =
        "<article class='result-card is-fallback'>" +
        "<p class='card-tag'>Fallback</p>" +
        "<h3>The VIN decoder did not respond.</h3>" +
        "<p>NHTSA VPIC timed out or blocked the request. Send the VIN with your inquiry and we will decode it on our side.</p>" +
        "<a class='btn btn-gold' href='" +
        inquireUrl({ product: "auto-insurance", need: "insurance", vin: vin }) +
        "'>Request a full auto quote</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Decoder timed out. Send the VIN with your inquiry.", "error");
    }
  }

  bindForm(form, run);
  if (input) {
    let timer;
    input.addEventListener("input", function () {
      input.value = cleanVin(input.value);
      clearTimeout(timer);
      if (input.value.length === 17) {
        timer = setTimeout(run, 400);
      }
    });
  }
}
