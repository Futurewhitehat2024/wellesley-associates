import { fetchJson, bindForm, setStatus, parseNumber, formatMoney, inquireUrl } from "./core.js";

const FALLBACK_CPI = 0.029;

function cpiRateFromBls(series) {
  const data = (((series || {}).Results || {}).series || [])[0];
  const rows = (data && data.data) || [];
  const monthly = rows.filter(function (row) {
    return /^M\d{2}$/.test(row.period) && row.value;
  });
  if (monthly.length < 13) return null;
  monthly.sort(function (a, b) {
    return String(a.year + a.period).localeCompare(String(b.year + b.period));
  });
  const latest = monthly[monthly.length - 1];
  const yearAgo = monthly[monthly.length - 13];
  const now = Number(latest.value);
  const then = Number(yearAgo.value);
  if (!now || !then) return null;
  return { rate: now / then - 1, asOf: latest.periodName + " " + latest.year };
}

export function initInflation() {
  const form = document.getElementById("inflation-form");
  const out = document.getElementById("inflation-result");
  const status = document.getElementById("inflation-status");
  const cpiLabel = document.getElementById("cpi-rate");
  let inflation = FALLBACK_CPI;
  let asOf = "fallback";

  async function loadCpi() {
    setStatus(status, "Loading CPI…");
    try {
      const data = await fetchJson("https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0");
      const parsed = cpiRateFromBls(data);
      if (!parsed) throw new Error("short series");
      inflation = parsed.rate;
      asOf = parsed.asOf;
      if (cpiLabel) cpiLabel.textContent = (inflation * 100).toFixed(1) + "% trailing 12 months · BLS CPI-U · " + asOf;
      setStatus(status, "CPI loaded from BLS.", "live");
    } catch (err) {
      inflation = FALLBACK_CPI;
      asOf = "published fallback";
      if (cpiLabel) cpiLabel.textContent = "2.9% trailing 12 months · fallback (BLS did not load)";
      setStatus(status, "BLS did not load. Using a 2.9% fallback inflation rate.", "error");
    }
  }

  bindForm(form, function () {
    const amount = parseNumber(form.querySelector("[name='cash']").value);
    const years = Number(form.querySelector("[name='years']").value);
    if (!amount || amount <= 0) {
      setStatus(status, "Enter a cash amount.", "error");
      return;
    }
    const remaining = amount / Math.pow(1 + inflation, years);
    const eroded = amount - remaining;
    const fixed = amount * Math.pow(1.03, years);
    const indexed = amount * Math.pow(1.045, years);
    const max = Math.max(amount, remaining, fixed, indexed);
    function bar(label, value, cls) {
      const w = Math.max(8, (value / max) * 100);
      return (
        "<div class='inflate-row'><span>" +
        label +
        "</span><strong>" +
        formatMoney(value) +
        "</strong><div class='inflate-track'><i class='" +
        cls +
        "' style='width:" +
        w +
        "%'></i></div></div>"
      );
    }
    const inquire = inquireUrl({
      product: "fixed-annuities",
      need: "annuities",
      cash: String(Math.round(amount)),
      years: String(years),
    });
    out.innerHTML =
      "<article class='result-card'>" +
      "<p class='card-tag'>Purchasing power</p>" +
      "<h3>" +
      formatMoney(amount) +
      " over " +
      years +
      " years</h3>" +
      "<p>At " +
      (inflation * 100).toFixed(1) +
      "% inflation (" +
      asOf +
      "), uninvested cash keeps about <strong>" +
      formatMoney(remaining) +
      "</strong> of today’s buying power. That is " +
      formatMoney(eroded) +
      " eroded by prices — not by a market loss.</p>" +
      bar("Uninvested cash, today’s dollars", remaining, "is-erode") +
      bar("Hypothetical 3.0% fixed growth", fixed, "is-fixed") +
      bar("Hypothetical 4.5% indexed growth", indexed, "is-index") +
      "<p class='disclaimer'>The 3.0% and 4.5% bars are illustrations only. They are not a quote, a cap, a participation rate, or a guarantee. Annuity rates depend on the contract, the carrier, and the date you buy. Annuities are not FDIC insured.</p>" +
      "<a class='btn btn-gold' href='" +
      inquire +
      "'>Ask about a fixed or indexed annuity</a>" +
      "</article>";
    out.hidden = false;
  });

  loadCpi();
}
