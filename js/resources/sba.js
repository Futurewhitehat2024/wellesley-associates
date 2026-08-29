import { bindForm, setStatus, parseNumber, formatMoney, inquireUrl } from "./core.js";

const RULES = {
  asOf: "July 4, 2026",
  sevenA: {
    maxLoan: 5000000,
    guarantyLow: 0.85,
    guarantyHigh: 0.75,
    split: 150000,
    termWc: 10,
    termRe: 25,
    termEquip: 10,
  },
  fiveOhFour: {
    maxDebenture: 5000000,
    maxMfg: 5500000,
    borrower: 0.1,
    cdc: 0.4,
    bank: 0.5,
    terms: [10, 20, 25],
  },
  combined: 10000000,
  dscr: { typicalMin: 1.15, note: "SBA does not publish one statutory DSCR. Many lenders underwrite global DSCR around 1.15x or higher." },
};

function guarantyPct(amount) {
  return amount <= RULES.sevenA.split ? RULES.sevenA.guarantyLow : RULES.sevenA.guarantyHigh;
}

function guarantyFee(amount) {
  const g = amount * guarantyPct(amount);
  if (amount <= 150000) return { fee: 0, note: "Loans at or under $150,000 often carry a $0 SBA guaranty fee when in effect; confirm current SBA fee notices." };
  if (g <= 700000) return { fee: g * 0.03, note: "Illustrative guaranty fee on the guaranteed portion (about 3% up to $700,000 guaranteed)." };
  if (g <= 1000000) return { fee: 700000 * 0.03 + (g - 700000) * 0.035, note: "Illustrative sliding guaranty fee on the guaranteed portion." };
  return {
    fee: 700000 * 0.03 + 300000 * 0.035 + (g - 1000000) * 0.0375,
    note: "Illustrative sliding guaranty fee. Live SBA fee tables can differ.",
  };
}

function row(label, value) {
  return "<div><dt>" + label + "</dt><dd>" + value + "</dd></div>";
}

export function initSba() {
  const form = document.getElementById("sba-form");
  const out = document.getElementById("sba-result");
  const status = document.getElementById("sba-status");

  bindForm(form, function () {
    const amount = parseNumber(form.querySelector("[name='amount']").value);
    const purpose = form.querySelector("[name='purpose']").value;
    if (!amount || amount < 25000) {
      setStatus(status, "Enter a financing amount of at least $25,000.", "error");
      return;
    }
    const sevenMax = Math.min(amount, RULES.sevenA.maxLoan);
    const gPct = guarantyPct(sevenMax);
    const gAmt = sevenMax * gPct;
    const fee = guarantyFee(sevenMax);
    const term = purpose === "cre" ? RULES.sevenA.termRe : purpose === "equipment" ? RULES.sevenA.termEquip : RULES.sevenA.termWc;
    const cdc = Math.min(amount * RULES.fiveOhFour.cdc, RULES.fiveOhFour.maxDebenture);
    const bank = amount * RULES.fiveOhFour.bank;
    const down = amount * RULES.fiveOhFour.borrower;
    const creFit = purpose === "cre";
    const product = purpose === "cre" ? "sba-loans" : purpose === "equipment" ? "equipment-financing" : "working-capital";
    const inquire = inquireUrl({
      product: product,
      need: "financing",
      amount: String(Math.round(amount)),
      purpose: purpose,
    });
    out.innerHTML =
      "<article class='result-card'>" +
      "<p class='card-tag'>SBA feasibility snapshot</p>" +
      "<h3>" +
      formatMoney(amount) +
      " · " +
      (purpose === "cre" ? "commercial real estate" : purpose === "equipment" ? "equipment" : "working capital") +
      "</h3>" +
      "<p>Rules as of " +
      RULES.asOf +
      ". Combined 7(a) + 504 outstanding can reach " +
      formatMoney(RULES.combined) +
      " for eligible borrowers. This is not credit approval.</p>" +
      "<h3 class='mini'>7(a)</h3>" +
      "<dl class='spec-list'>" +
      row("Program maximum", formatMoney(RULES.sevenA.maxLoan)) +
      row("Amount in this run", formatMoney(sevenMax) + (amount > RULES.sevenA.maxLoan ? " (capped)" : "")) +
      row("Illustrative guaranty", (gPct * 100).toFixed(0) + "% → " + formatMoney(gAmt)) +
      row("Illustrative guaranty fee", formatMoney(fee.fee)) +
      row("Typical maximum term", term + " years") +
      "</dl>" +
      "<p class='form-note'>" +
      fee.note +
      "</p>" +
      "<h3 class='mini'>504" +
      (creFit ? "" : " (usually owner-occupied real estate / long-life equipment)") +
      "</h3>" +
      "<dl class='spec-list'>" +
      row("Typical stack", "50% first mortgage / 40% CDC debenture / 10% borrower") +
      row("CDC / debenture cap", formatMoney(RULES.fiveOhFour.maxDebenture) + " (" + formatMoney(RULES.fiveOhFour.maxMfg) + " manufacturing)") +
      row("If applied to this amount", "Bank " + formatMoney(bank) + " · CDC " + formatMoney(cdc) + " · Down " + formatMoney(down)) +
      row("Typical terms", RULES.fiveOhFour.terms.join(" / ") + " years") +
      "</dl>" +
      "<h3 class='mini'>DSCR</h3>" +
      "<p>" +
      RULES.dscr.note +
      " Treat <strong>" +
      RULES.dscr.typicalMin.toFixed(2) +
      "x</strong> as a common lender starting point, not a promise.</p>" +
      "<p class='disclaimer'>Guaranty percentages, fees, occupancy rules, and eligibility change. Working capital is usually a 7(a) conversation. Owner-occupied CRE is often 504 or 7(a). This tool does not underwrite the file.</p>" +
      "<a class='btn btn-gold' href='" +
      inquire +
      "'>Request an SBA / commercial financing review</a>" +
      "</article>";
    out.hidden = false;
    setStatus(status, "Snapshot uses published SBA 7(a) and 504 rules as of " + RULES.asOf + ".", "live");
  });

  setStatus(status, "Published SBA 7(a) and 504 program rules as of " + RULES.asOf + ".");
}
