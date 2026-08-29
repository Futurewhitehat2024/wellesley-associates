import { bindForm, setStatus, parseNumber, formatMoney, inquireUrl, specRow } from "./core.js";

function band(dscr) {
  if (dscr < 1.15) {
    return {
      cls: "is-on",
      label: "High risk / needs structuring",
      note: "Below 1.15x, most commercial files need a different structure — more equity, a longer term, or another facility.",
    };
  }
  if (dscr < 1.2) {
    return {
      cls: "is-mid",
      label: "Tight",
      note: "Between 1.15x and 1.20x is often workable only with extra structure. Lenders will look hard at global cash flow.",
    };
  }
  if (dscr <= 1.35) {
    return {
      cls: "is-off",
      label: "Standard commercial fit",
      note: "1.20x to 1.35x is a common commercial lending range. The rest of the file still has to underwrite.",
    };
  }
  return {
    cls: "is-off",
    label: "Strong qualification",
    note: "Above 1.35x is a strong coverage ratio. Credit, collateral, and use of proceeds still decide the deal.",
  };
}

export function initDscr() {
  const form = document.getElementById("dscr-form");
  const out = document.getElementById("dscr-result");
  const status = document.getElementById("dscr-status");
  if (!form) return;

  function render() {
    const noi = parseNumber(form.querySelector("[name='noi']").value);
    const debt = parseNumber(form.querySelector("[name='debt']").value);
    if (!noi || noi <= 0 || !debt || debt <= 0) {
      out.hidden = true;
      setStatus(status, "Annual NOI and annual principal + interest. Updates as you type.");
      return;
    }
    const dscr = noi / debt;
    const info = band(dscr);
    const inquire = inquireUrl({
      product: "commercial-real-estate",
      need: "financing",
      type: "loan",
      amount: String(Math.round(debt)),
    });
    const width = Math.max(8, Math.min(100, (dscr / 2) * 100));
    out.innerHTML =
      "<article class='result-card'>" +
      "<p class='card-tag'>DSCR</p>" +
      "<h3>" +
      dscr.toFixed(2) +
      "x</h3>" +
      "<div class='risk-pills'><span class='risk-pill " +
      info.cls +
      "'>" +
      info.label +
      "</span></div>" +
      "<div class='inflate-row'><span>Coverage vs 2.00x</span><strong>" +
      dscr.toFixed(2) +
      "x</strong><div class='inflate-track'><i class='" +
      (dscr < 1.2 ? "is-erode" : dscr <= 1.35 ? "is-fixed" : "is-index") +
      "' style='width:" +
      width +
      "%'></i></div></div>" +
      "<dl class='spec-list'>" +
      specRow("Annual NOI", formatMoney(noi)) +
      specRow("Annual debt service", formatMoney(debt)) +
      specRow("DSCR", dscr.toFixed(2) + "x") +
      specRow("< 1.15x", "High risk / structuring") +
      specRow("1.20x – 1.35x", "Standard commercial fit") +
      specRow("> 1.35x", "Strong qualification") +
      "</dl>" +
      "<p>" +
      info.note +
      "</p>" +
      "<p class='disclaimer'>DSCR = NOI ÷ annual principal and interest. This is a calculator, not a credit decision or a term sheet.</p>" +
      "<a class='btn btn-gold' href='" +
      inquire +
      "'>Ask about commercial financing</a>" +
      "</article>";
    out.hidden = false;
    setStatus(status, "Calculated on this page. Nothing is sent until you ask for a review.", "live");
  }

  bindForm(form, render);
  form.addEventListener("input", render);
}
