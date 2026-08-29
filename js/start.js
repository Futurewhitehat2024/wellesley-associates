(function () {
  const form = document.querySelector("[data-start]");
  if (!form) return;

  const need = form.querySelector("[name='need']");
  const kind = form.querySelector("[name='kind']");
  const status = form.querySelector("[data-start-status]");
  const continueBtn = form.querySelector("[data-start-go]");
  const calendly = form.getAttribute("data-calendly");
  const talkTitle = document.querySelector("[data-talk-title]");
  const slugMap = form.querySelector("[data-slug-map]");

  const panels = {
    insurance: form.querySelector("[data-panel='insurance']"),
    personal: form.querySelector("[data-panel='personal']"),
    commercial: form.querySelector("[data-panel='commercial']"),
    life: form.querySelector("[data-panel='life']"),
    talk: document.querySelector("[data-panel='talk']"),
  };

  const talkCopy = {
    annuities: "Tell us about the annuity.",
    financing: "Tell us about the financing request.",
    unsure: "Tell us what you need.",
  };

  function show(el, on) {
    if (!el) return;
    el.hidden = !on;
  }

  function setNote(text) {
    if (!status) return;
    status.textContent = text || "";
    status.classList.toggle("is-error", Boolean(text));
  }

  function escapeAttr(value) {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function sync() {
    const n = need.value;
    const k = kind.value;
    show(panels.insurance, n === "insurance");
    show(panels.personal, n === "insurance" && k === "personal");
    show(panels.commercial, n === "insurance" && k === "commercial");
    show(panels.life, n === "insurance" && k === "life");
    const talk = n === "annuities" || n === "financing" || n === "unsure";
    show(panels.talk, talk);
    if (talk && talkTitle) talkTitle.textContent = talkCopy[n] || talkCopy.unsure;
    if (continueBtn) {
      if (n === "call") continueBtn.textContent = "Open calendar";
      else if (n === "insurance") continueBtn.textContent = "Continue to quote";
      else continueBtn.textContent = "Continue";
    }
    setNote("");
  }

  function selectedHref(select) {
    if (!select || !select.selectedOptions.length) return "";
    return select.selectedOptions[0].getAttribute("data-href") || "";
  }

  function nextStep() {
    const n = need.value;
    if (!n) return { error: "Choose what you need to continue." };
    if (n === "call") return { href: calendly, external: true };
    if (n === "annuities" || n === "financing" || n === "unsure") return { panel: "talk" };
    if (n !== "insurance") return { error: "Choose what you need to continue." };
    const k = kind.value;
    if (!k) return { error: "Choose the kind of insurance." };
    const lineSelect = form.querySelector("[name='" + k + "_line']");
    let href = selectedHref(lineSelect) || selectedHref(kind);
    if (!href) return { error: "Choose the kind of insurance." };
    const coverage = lineSelect ? String(lineSelect.value || "").trim() : "";
    if (coverage && coverage !== "details") {
      href += (href.indexOf("?") >= 0 ? "&" : "?") + "coverage=" + encodeURIComponent(coverage);
    }
    return { href: href };
  }

  need.addEventListener("change", sync);
  kind.addEventListener("change", sync);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const next = nextStep();
    if (next.error) {
      setNote(next.error);
      return;
    }
    if (next.panel === "talk") {
      show(panels.talk, true);
      if (panels.talk) panels.talk.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (next.external) {
      window.open(next.href, "_blank", "noopener");
      return;
    }
    if (next.href) window.location.href = next.href;
  });

  const params = new URLSearchParams(window.location.search);
  const product = params.get("product") || "";
  if (params.get("type") === "loan") need.value = "financing";
  if (product) {
    const line = form.querySelector('option[data-slug="' + escapeAttr(product) + '"]');
    if (line && line.closest("select")) {
      const select = line.closest("select");
      const name = select.getAttribute("name");
      need.value = "insurance";
      if (name === "personal_line") kind.value = "personal";
      if (name === "commercial_line") kind.value = "commercial";
      if (name === "life_line") kind.value = "life";
      line.selected = true;
    } else if (slugMap) {
      const mapped = slugMap.querySelector('option[data-slug="' + escapeAttr(product) + '"]');
      if (mapped) need.value = mapped.getAttribute("data-need") || "";
    }
  }
  sync();
})();
