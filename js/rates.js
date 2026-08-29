(function () {
  const dashboard = document.getElementById("rates-dashboard");
  if (!dashboard) return;

  const TIMEOUT_MS = 8000;
  const FRED_API_KEY = "";
  const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

  const FALLBACK = {
    FEDFUNDS: { value: 3.62, date: "2026-07-31" },
    SOFR: { value: 3.66, date: "2026-08-28" },
    DPRIME: { value: 6.5, date: "2026-08-28" },
    MORTGAGE30US: { value: 6.35, date: "2026-08-20" },
    MORTGAGE15US: { value: 5.72, date: "2026-08-20" },
    DGS5: { value: 4.48, date: "2026-08-28" },
    DGS10: { value: 4.73, date: "2026-08-28" },
    DGS30: { value: 5.22, date: "2026-08-28" },
    BAMLC0A4CBBB: { value: 5.88, date: "2026-08-28" },
    YC_1M: { value: 3.84, date: "2026-08-28" },
    YC_3M: { value: 3.9, date: "2026-08-28" },
    YC_6M: { value: 4.02, date: "2026-08-28" },
    YC_1Y: { value: 4.15, date: "2026-08-28" },
    YC_2Y: { value: 4.34, date: "2026-08-28" },
    YC_5Y: { value: 4.48, date: "2026-08-28" },
    YC_10Y: { value: 4.73, date: "2026-08-28" },
    YC_30Y: { value: 5.22, date: "2026-08-28" },
  };

  const FRED_SERIES = [
    "FEDFUNDS",
    "SOFR",
    "DPRIME",
    "MORTGAGE30US",
    "MORTGAGE15US",
    "DGS5",
    "DGS10",
    "DGS30",
    "BAMLC0A4CBBB",
    "DGS1MO",
    "DGS3MO",
    "DGS6MO",
    "DGS1",
    "DGS2",
  ];

  const FRED_TO_CARD = {
    FEDFUNDS: "FEDFUNDS",
    SOFR: "SOFR",
    DPRIME: "DPRIME",
    MORTGAGE30US: "MORTGAGE30US",
    MORTGAGE15US: "MORTGAGE15US",
    DGS5: "DGS5",
    DGS10: "DGS10",
    DGS30: "DGS30",
    BAMLC0A4CBBB: "BAMLC0A4CBBB",
    DGS1MO: "YC_1M",
    DGS3MO: "YC_3M",
    DGS6MO: "YC_6M",
    DGS1: "YC_1Y",
    DGS2: "YC_2Y",
  };

  const CURVE_KEYS = ["YC_1M", "YC_3M", "YC_6M", "YC_1Y", "YC_2Y", "YC_5Y", "YC_10Y", "YC_30Y"];

  const state = {};
  Object.keys(FALLBACK).forEach(function (key) {
    state[key] = Object.assign({ live: false, source: "fallback" }, FALLBACK[key]);
  });

  function parseNumber(value) {
    if (value == null) return null;
    const n = Number(String(value).replace(/[%,\s]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  function formatRate(value) {
    if (value == null) return "—";
    return value.toFixed(2) + "%";
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(String(value).slice(0, 10) + "T12:00:00");
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function latestObservation(rows) {
    if (!rows || !rows.length) return null;
    for (let i = rows.length - 1; i >= 0; i -= 1) {
      const row = rows[i];
      const value = parseNumber(row.value);
      if (value != null) return { value: value, date: row.date };
    }
    return null;
  }

  function fetchTimeout(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(function () {
      ctrl.abort();
    }, ms || TIMEOUT_MS);
    return fetch(url, { signal: ctrl.signal, cache: "no-store" }).finally(function () {
      clearTimeout(timer);
    });
  }

  async function fetchText(url) {
    const attempts = [
      url,
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(url),
      "https://corsproxy.io/?" + encodeURIComponent(url),
    ];
    let lastError;
    for (let i = 0; i < attempts.length; i += 1) {
      try {
        const res = await fetchTimeout(attempts[i], TIMEOUT_MS);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const text = await res.text();
        if (!text || /access denied|blocked|just a moment/i.test(text.slice(0, 200))) {
          throw new Error("blocked");
        }
        return text;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("unavailable");
  }

  function setPoint(key, value, date, source) {
    if (value == null || !key) return;
    state[key] = { value: value, date: date, live: true, source: source };
  }

  async function loadFredSeries(id) {
    const start = "2024-01-01";
    const csvUrl = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=" + encodeURIComponent(id) + "&cosd=" + start;
    const apiUrl =
      FRED_BASE +
      "?series_id=" +
      encodeURIComponent(id) +
      "&file_type=json&sort_order=asc&limit=24&observation_start=" +
      start +
      (FRED_API_KEY ? "&api_key=" + encodeURIComponent(FRED_API_KEY) : "");

    const urls = FRED_API_KEY ? [apiUrl, csvUrl] : [csvUrl, apiUrl];
    for (let i = 0; i < urls.length; i += 1) {
      try {
        const text = await fetchText(urls[i]);
        const parsed = text.trim().charAt(0) === "{" ? parseFredJson(text) : parseFredCsv(text);
        const latest = latestObservation(parsed);
        if (latest) return latest;
      } catch (err) {}
    }
    return null;
  }

  function parseFredJson(text) {
    const data = JSON.parse(text);
    const rows = data.observations || [];
    return rows.map(function (row) {
      return { date: row.date, value: row.value };
    });
  }

  function parseFredCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
      const parts = lines[i].split(",");
      if (parts.length < 2) continue;
      rows.push({ date: parts[0], value: parts[1] });
    }
    return rows;
  }

  function ds(node, name) {
    if (!node) return null;
    const ns = "http://schemas.microsoft.com/ado/2007/08/dataservices";
    const el = node.getElementsByTagNameNS(ns, name)[0] || node.querySelector(name);
    return el ? el.textContent : null;
  }

  async function loadTreasuryCurve() {
    const now = new Date();
    const months = [0, -1].map(function (offset) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      return y + m;
    });
    const urls = months.map(function (ym) {
      return (
        "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value_month=" +
        ym
      );
    });
    urls.push(
      "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=" +
        now.getUTCFullYear()
    );

    for (let i = 0; i < urls.length; i += 1) {
      try {
        const xml = await fetchText(urls[i]);
        const parsed = parseTreasuryXml(xml);
        if (parsed) return parsed;
      } catch (err) {}
    }
    return null;
  }

  function parseTreasuryXml(xmlText) {
    const doc = new DOMParser().parseFromString(xmlText, "text/xml");
    if (doc.querySelector("parsererror")) return null;
    const entries = Array.from(doc.getElementsByTagName("entry"));
    if (!entries.length) return null;
    const last = entries[entries.length - 1];
    const props = last.getElementsByTagName("content")[0] || last;
    const dateRaw = ds(props, "NEW_DATE") || "";
    const date = dateRaw.slice(0, 10);
    const map = {
      YC_1M: "BC_1MONTH",
      YC_3M: "BC_3MONTH",
      YC_6M: "BC_6MONTH",
      YC_1Y: "BC_1YEAR",
      YC_2Y: "BC_2YEAR",
      YC_5Y: "BC_5YEAR",
      YC_10Y: "BC_10YEAR",
      YC_30Y: "BC_30YEAR",
    };
    const out = { date: date, points: {} };
    Object.keys(map).forEach(function (key) {
      const value = parseNumber(ds(props, map[key]));
      if (value != null) out.points[key] = value;
    });
    return Object.keys(out.points).length ? out : null;
  }

  async function loadFiscalData() {
    const url =
      "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?sort=-record_date&page[size]=20";
    const text = await fetchText(url);
    const data = JSON.parse(text);
    return Array.isArray(data.data) ? data.data : [];
  }

  function paint() {
    document.querySelectorAll("[data-rate]").forEach(function (el) {
      const key = el.getAttribute("data-rate");
      const point = state[key] || FALLBACK[key];
      if (!point) return;
      const valueEl = el.querySelector(".rate-value");
      const metaEl = el.querySelector(".rate-meta");
      if (valueEl) valueEl.textContent = formatRate(point.value);
      if (metaEl) {
        const label = point.live ? "Live" : "Fallback";
        metaEl.textContent = label + " · as of " + formatDate(point.date);
      }
      el.classList.toggle("is-live", Boolean(point.live));
      el.classList.toggle("is-fallback", !point.live);
    });

    const curveDate = (state.YC_10Y && state.YC_10Y.date) || FALLBACK.YC_10Y.date;
    const curveMeta = document.getElementById("curve-meta");
    if (curveMeta) {
      const liveCount = CURVE_KEYS.filter(function (key) {
        return state[key] && state[key].live;
      }).length;
      curveMeta.textContent =
        (liveCount ? "U.S. Treasury par yields" : "Published fallbacks") + " · as of " + formatDate(curveDate);
    }

    const values = CURVE_KEYS.map(function (key) {
      return (state[key] && state[key].value) || FALLBACK[key].value;
    });
    const max = Math.max.apply(null, values.concat([1]));
    document.querySelectorAll("[data-curve]").forEach(function (el) {
      const key = el.getAttribute("data-curve");
      const point = state[key] || FALLBACK[key];
      const bar = el.querySelector(".curve-fill");
      const label = el.querySelector(".curve-rate");
      if (label) label.textContent = formatRate(point.value);
      if (bar) bar.style.height = Math.max(8, (point.value / max) * 100) + "%";
      el.classList.toggle("is-live", Boolean(point.live));
    });

    const status = document.getElementById("rates-status");
    if (status) {
      const live = Object.keys(state).filter(function (key) {
        return state[key].live;
      }).length;
      const total = Object.keys(state).length;
      if (live === 0) {
        status.textContent = "Feeds timed out. Showing published fallback rates.";
      } else if (live < total) {
        status.textContent = "Updated " + live + " of " + total + " series. Fallback used where a feed did not respond.";
      } else {
        status.textContent = "All series updated from Treasury and FRED.";
      }
    }
  }

  async function loadAll() {
    dashboard.classList.add("is-loading");
    paint();

    const jobs = [
      loadTreasuryCurve()
        .then(function (curve) {
          if (!curve) return;
          Object.keys(curve.points).forEach(function (key) {
            setPoint(key, curve.points[key], curve.date, "treasury");
          });
          setPoint("DGS5", curve.points.YC_5Y, curve.date, "treasury");
          setPoint("DGS10", curve.points.YC_10Y, curve.date, "treasury");
          setPoint("DGS30", curve.points.YC_30Y, curve.date, "treasury");
        })
        .catch(function () {}),
      loadFiscalData().catch(function () {
        return [];
      }),
    ];

    FRED_SERIES.forEach(function (id) {
      jobs.push(
        loadFredSeries(id)
          .then(function (latest) {
            if (!latest) return;
            const card = FRED_TO_CARD[id];
            if (card && !(state[card] && state[card].live && state[card].source === "treasury")) {
              setPoint(card, latest.value, latest.date, "fred");
            }
            if (id === "DGS5" || id === "DGS10" || id === "DGS30") {
              const curveKey = id === "DGS5" ? "YC_5Y" : id === "DGS10" ? "YC_10Y" : "YC_30Y";
              if (!(state[curveKey] && state[curveKey].live && state[curveKey].source === "treasury")) {
                setPoint(curveKey, latest.value, latest.date, "fred");
              }
            }
          })
          .catch(function () {})
      );
    });

    await Promise.allSettled(jobs);
    dashboard.classList.remove("is-loading");
    paint();
  }

  const refresh = document.getElementById("rates-refresh");
  if (refresh) {
    refresh.addEventListener("click", function () {
      loadAll();
    });
  }

  loadAll();
})();
