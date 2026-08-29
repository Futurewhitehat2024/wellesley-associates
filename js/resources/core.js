const TIMEOUT_MS = 8000;
const GET_STARTED = "../get-started.html";

export function inquireUrl(params) {
  const q = new URLSearchParams(params);
  return GET_STARTED + "?" + q.toString();
}

export function parseNumber(value) {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function formatMoney(value) {
  if (value == null) return "—";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatPct(value, digits) {
  if (value == null) return "—";
  return (value * (Math.abs(value) < 1.5 && Math.abs(value) > 0 ? 100 : 1)).toFixed(digits == null ? 2 : digits) + "%";
}

export function formatRate(value) {
  if (value == null) return "—";
  return Number(value).toFixed(2) + "%";
}

export function setStatus(el, text, kind) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("is-error", kind === "error");
  el.classList.toggle("is-live", kind === "live");
}

function fetchTimeout(url, options) {
  const ctrl = new AbortController();
  const timer = setTimeout(function () {
    ctrl.abort();
  }, TIMEOUT_MS);
  const opts = Object.assign({ cache: "no-store" }, options || {}, { signal: ctrl.signal });
  return fetch(url, opts).finally(function () {
    clearTimeout(timer);
  });
}

export async function fetchText(url, options) {
  const attempts = [
    url,
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(url),
    "https://corsproxy.io/?" + encodeURIComponent(url),
  ];
  let lastError;
  for (let i = 0; i < attempts.length; i += 1) {
    try {
      const res = await fetchTimeout(attempts[i], i === 0 ? options : undefined);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      if (!text || /just a moment|access denied/i.test(text.slice(0, 180))) throw new Error("blocked");
      return text;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("unavailable");
}

export async function fetchJson(url, options) {
  const text = await fetchText(url, options);
  return JSON.parse(text);
}

export function bindForm(form, handler) {
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    handler(form);
  });
}
