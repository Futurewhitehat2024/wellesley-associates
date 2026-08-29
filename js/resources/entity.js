import {
  fetchJson,
  bindForm,
  setStatus,
  escapeHtml,
  specRow,
  commercialIntakeUrl,
} from "./core.js";

function mapEntityType(value) {
  const text = String(value || "").toLowerCase();
  if (/llc|limited liability/.test(text)) return "LLC";
  if (/corp|inc\.|incorporated/.test(text)) return "Corporation";
  if (/partner/.test(text)) return "Partnership";
  if (/sole|propriet/.test(text)) return "Sole proprietor";
  return "Other";
}

function yearFrom(date) {
  const match = String(date || "").match(/^(\d{4})/);
  return match ? match[1] : "";
}

function yearsOpen(date) {
  const year = Number(yearFrom(date));
  if (!year) return "";
  return String(Math.max(0, new Date().getFullYear() - year));
}

function intakeLink(row) {
  const params = { company: row.name, state: row.state };
  if (row.entityType) params.entity_type = row.entityType;
  if (row.years) params.years_in_business = row.years;
  return commercialIntakeUrl(params);
}

function normalizeOpenCorporates(payload, state) {
  const rows = (((payload || {}).results || {}).companies || []).map(function (wrap) {
    const c = wrap.company || wrap;
    return {
      name: c.name || "",
      status: c.current_status || (c.inactive ? "Inactive" : "Active"),
      type: c.company_type || "",
      entityType: mapEntityType(c.company_type),
      incorporated: c.incorporation_date || "",
      year: yearFrom(c.incorporation_date),
      years: yearsOpen(c.incorporation_date),
      number: c.company_number || "",
      state: state,
    };
  });
  return rows.filter(function (row) {
    return row.name;
  });
}

function normalizeGleif(payload, state) {
  return ((payload && payload.data) || [])
    .map(function (rec) {
      const attrs = rec.attributes || {};
      const entity = attrs.entity || {};
      const legal = (entity.legalName && entity.legalName.name) || "";
      const form = (entity.legalForm && (entity.legalForm.id || entity.legalForm.other || "")) || "";
      const registered = attrs.registration || {};
      return {
        name: legal,
        status: entity.status || registered.status || "",
        type: form,
        entityType: mapEntityType(form),
        incorporated: entity.creationDate || registered.initialRegistrationDate || "",
        year: yearFrom(entity.creationDate || registered.initialRegistrationDate),
        years: yearsOpen(entity.creationDate || registered.initialRegistrationDate),
        number: attrs.lei || "",
        state: state,
      };
    })
    .filter(function (row) {
      return row.name;
    });
}

async function searchRegistry(name, state) {
  const jurisdiction = "us_" + String(state || "").toLowerCase();
  try {
    const oc = await fetchJson(
      "https://api.opencorporates.com/v0.4/companies/search?q=" +
        encodeURIComponent(name) +
        "&jurisdiction_code=" +
        encodeURIComponent(jurisdiction) +
        "&per_page=5"
    );
    const rows = normalizeOpenCorporates(oc, state);
    if (rows.length) return rows;
  } catch (err) {}
  try {
    const gleif = await fetchJson(
      "https://api.gleif.org/api/v1/lei-records?page[size]=5&filter[entity.legalName]=" + encodeURIComponent(name)
    );
    const rows = normalizeGleif(gleif, state);
    if (rows.length) return rows;
  } catch (err) {}
  return [];
}

function standing(status) {
  const text = String(status || "").toLowerCase();
  if (/active|good standing|live/.test(text)) return { on: false, label: status || "Active" };
  if (/inactive|dissolv|forfeit|revok|expired|terminat/.test(text)) return { on: true, label: status || "Inactive" };
  return { on: false, label: status || "See filing" };
}

function renderPick(rows) {
  if (rows.length === 1) return renderCard(rows[0]);
  return (
    "<article class='result-card'>" +
    "<p class='card-tag'>Registry matches</p>" +
    "<h3>Select the legal entity.</h3>" +
    "<p>We will put the official name on the commercial quote form.</p>" +
    "<div class='entity-picks'>" +
    rows
      .map(function (row, index) {
        return (
          "<button type='button' class='entity-pick' data-entity-index='" +
          index +
          "'><strong>" +
          escapeHtml(row.name) +
          "</strong><span>" +
          escapeHtml(row.status || "Status not listed") +
          " · " +
          escapeHtml(row.type || row.entityType || "Entity") +
          (row.year ? " · " + row.year : "") +
          "</span></button>"
        );
      })
      .join("") +
    "</div>" +
    "</article>"
  );
}

function renderCard(row) {
  const stand = standing(row.status);
  return (
    "<article class='result-card'>" +
    "<p class='card-tag'>Entity status</p>" +
    "<h3>" +
    escapeHtml(row.name) +
    "</h3>" +
    "<div class='risk-pills'>" +
    "<span class='risk-pill " +
    (stand.on ? "is-on" : "is-off") +
    "'>" +
    escapeHtml(stand.label) +
    "</span>" +
    "<span class='risk-pill is-off'>" +
    escapeHtml(row.entityType || "Entity") +
    "</span>" +
    "</div>" +
    "<dl class='spec-list'>" +
    specRow("Official name", escapeHtml(row.name)) +
    specRow("Status", escapeHtml(row.status || "—")) +
    specRow("Entity type", escapeHtml(row.type || row.entityType || "—")) +
    specRow("Registration year", escapeHtml(row.year || "—")) +
    specRow("State", escapeHtml(row.state || "—")) +
    "</dl>" +
    "<p class='disclaimer'>Registry data can lag. Confirm the name against the secretary of state printout before binding. This is not a certificate of good standing.</p>" +
    "<a class='btn btn-gold' href='" +
    intakeLink(row) +
    "'>Use this name on the commercial quote</a>" +
    "</article>"
  );
}

export function initEntity() {
  const form = document.getElementById("entity-form");
  const out = document.getElementById("entity-result");
  const status = document.getElementById("entity-status");
  if (!form) return;
  let matches = [];

  out.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-entity-index]");
    if (!btn) return;
    const row = matches[Number(btn.getAttribute("data-entity-index"))];
    if (!row) return;
    out.innerHTML = renderCard(row);
    out.hidden = false;
  });

  bindForm(form, async function () {
    const name = String(form.querySelector("[name='company']").value || "").trim();
    const state = form.querySelector("[name='state']").value;
    if (!name || !state) {
      setStatus(status, "Enter a company name and state.", "error");
      return;
    }
    setStatus(status, "Checking the company registry…");
    out.hidden = true;
    try {
      matches = await searchRegistry(name, state);
      if (!matches.length) {
        matches = [
          {
            name: name,
            status: "Not confirmed live",
            type: "",
            entityType: "",
            year: "",
            years: "",
            state: state,
          },
        ];
        out.innerHTML =
          "<article class='result-card is-fallback'>" +
          "<p class='card-tag'>Entity status</p>" +
          "<h3>No live registry match.</h3>" +
          "<p>We can still put <strong>" +
          escapeHtml(name) +
          "</strong> on the commercial quote. Confirm it matches the articles of organization before we bind.</p>" +
          "<a class='btn btn-gold' href='" +
          intakeLink(matches[0]) +
          "'>Use this name on the commercial quote</a>" +
          "</article>";
        out.hidden = false;
        setStatus(status, "No live match. You can still send the name we have.");
        return;
      }
      out.innerHTML = renderPick(matches);
      out.hidden = false;
      setStatus(status, "Registry results ready. Pick the legal name to continue.", "live");
    } catch (err) {
      matches = [{ name: name, status: "", type: "", entityType: "", year: "", years: "", state: state }];
      out.innerHTML =
        "<article class='result-card is-fallback'>" +
        "<p class='card-tag'>Entity status</p>" +
        "<h3>The registry did not respond.</h3>" +
        "<p>We can still start the commercial quote with <strong>" +
        escapeHtml(name) +
        "</strong>.</p>" +
        "<a class='btn btn-gold' href='" +
        intakeLink(matches[0]) +
        "'>Use this name on the commercial quote</a>" +
        "</article>";
      out.hidden = false;
      setStatus(status, "Registry timed out. You can still send the name we have.", "error");
    }
  });
}
