import { bindForm, setStatus, parseNumber, formatMoney, inquireUrl, specRow } from "./core.js";

// SSA Period Life Table 2021 (Table 4c6), remaining life expectancy at selected ages.
// Linear interpolation between points. Planning illustration only.
const SSA_E = {
  M: [
    [25, 49.56],
    [30, 44.88],
    [35, 40.25],
    [40, 35.68],
    [45, 31.22],
    [50, 26.92],
    [55, 22.84],
    [60, 19.03],
    [65, 15.5],
    [70, 12.27],
    [75, 9.38],
    [80, 6.9],
    [85, 4.89],
    [90, 3.34],
    [95, 2.27],
    [100, 1.54],
  ],
  F: [
    [25, 55.04],
    [30, 50.18],
    [35, 45.36],
    [40, 40.58],
    [45, 35.88],
    [50, 31.28],
    [55, 26.85],
    [60, 22.61],
    [65, 18.56],
    [70, 14.76],
    [75, 11.26],
    [80, 8.22],
    [85, 5.74],
    [90, 3.86],
    [95, 2.58],
    [100, 1.77],
  ],
};

function remainingLife(age, gender) {
  const series = SSA_E[gender] || SSA_E.M;
  if (age <= series[0][0]) return series[0][1];
  for (let i = 1; i < series.length; i += 1) {
    if (age <= series[i][0]) {
      const a0 = series[i - 1][0];
      const a1 = series[i][0];
      const e0 = series[i - 1][1];
      const e1 = series[i][1];
      return e0 + ((age - a0) / (a1 - a0)) * (e1 - e0);
    }
  }
  return series[series.length - 1][1];
}

function bar(label, value, max, cls) {
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

export function initLongevity() {
  const form = document.getElementById("longevity-form");
  const out = document.getElementById("longevity-result");
  const status = document.getElementById("longevity-status");
  if (!form) return;

  bindForm(form, function () {
    const age = parseNumber(form.querySelector("[name='age']").value);
    const gender = form.querySelector("[name='gender']").value || "M";
    const monthly = parseNumber(form.querySelector("[name='income']").value);
    const retire = parseNumber(form.querySelector("[name='retire']").value) || 67;
    const have = parseNumber(form.querySelector("[name='have']").value) || 0;
    if (!age || age < 25 || age > 100) {
      setStatus(status, "Enter a current age between 25 and 100.", "error");
      return;
    }
    if (!monthly || monthly <= 0) {
      setStatus(status, "Enter the monthly income you want in retirement.", "error");
      return;
    }
    const expect = remainingLife(age, gender);
    const horizon = age + expect;
    const start = Math.max(age, retire);
    const years = Math.max(0, horizon - start);
    const needAnnual = monthly * 12;
    const haveAnnual = have * 12;
    const needTotal = needAnnual * years;
    const haveTotal = haveAnnual * years;
    const gapTotal = Math.max(0, needTotal - haveTotal);
    const gapMonthly = Math.max(0, monthly - have);
    const max = Math.max(needTotal, haveTotal, 1);
    const inquire = inquireUrl({
      product: "income-annuities",
      need: "annuities",
      amount: String(Math.round(gapTotal)),
    });
    out.innerHTML =
      "<article class='result-card'>" +
      "<p class='card-tag'>Longevity &amp; income gap</p>" +
      "<h3>Plan to about age " +
      Math.round(horizon) +
      "</h3>" +
      "<p>SSA period life table remaining expectancy at age " +
      Math.round(age) +
      " is about <strong>" +
      expect.toFixed(1) +
      " years</strong>. If income starts at " +
      Math.round(start) +
      ", that is roughly <strong>" +
      years.toFixed(1) +
      " years</strong> of checks.</p>" +
      "<dl class='spec-list'>" +
      specRow("Longevity horizon", "Age " + Math.round(horizon)) +
      specRow("Retirement years in this run", years.toFixed(1)) +
      specRow("Desired monthly income", formatMoney(monthly)) +
      specRow("Already expected monthly", formatMoney(have)) +
      specRow("Monthly gap", formatMoney(gapMonthly)) +
      specRow("Cumulative income need", formatMoney(needTotal)) +
      specRow("Cumulative gap", formatMoney(gapTotal)) +
      "</dl>" +
      bar("Desired income over the horizon", needTotal, max, "is-erode") +
      bar("Income you already expect", haveTotal, max, "is-fixed") +
      bar("Gap a lifetime annuity can be built to cover", gapTotal, max, "is-index") +
      "<p>A lifetime income annuity is designed to turn a lump sum into a paycheck you cannot outlive. It is one way to cover that gap. It is not a market account and not FDIC insured.</p>" +
      "<p class='disclaimer'>SSA period life table, 2021 (Table 4c6), interpolated. Averages, not a forecast of your life. This is not a quote, tax advice, or an illustration of a specific contract.</p>" +
      "<a class='btn btn-gold' href='" +
      inquire +
      "'>Ask about a guaranteed income stream</a>" +
      "</article>";
    out.hidden = false;
    setStatus(status, "Using SSA period life table remaining expectancy.", "live");
  });
}
