// Downloads the FRED series used by js/rates.js and writes data/rates.json.
// No API key. Same public CSV the page used to request in the browser:
// https://fred.stlouisfed.org/graph/fredgraph.csv?id=SERIES&cosd=YYYY-MM-DD
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "data", "rates.json");

// Keep this list identical to FRED_SERIES in js/rates.js.
const SERIES = [
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

const OBSERVATION_START = "2024-01-01";
const HISTORY_LIMIT = 90;
const USER_AGENT = "Mozilla/5.0 (compatible; WellesleyCollectiveRates/1.0; +https://wellesleycollective.com)";
const TREASURY_XML =
  "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value_month=";

// FRED DGS* series trail the Treasury par curve by about a day. Same tenors
// the rates page already reads from the daily yield curve XML.
const TREASURY_FIELDS = {
  DGS1MO: "BC_1MONTH",
  DGS3MO: "BC_3MONTH",
  DGS6MO: "BC_6MONTH",
  DGS1: "BC_1YEAR",
  DGS2: "BC_2YEAR",
  DGS5: "BC_5YEAR",
  DGS10: "BC_10YEAR",
  DGS30: "BC_30YEAR",
};

function cleanNumber(raw) {
  if (raw == null) return null;
  const text = String(raw).trim();
  if (!text || text === ".") return null;
  const value = Number(text);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 10000) / 10000;
}

export function parseCsv(text, id) {
  const lines = String(text).replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines.length < 2 || /<html|access denied|just a moment/i.test(lines[0])) {
    throw new Error("FRED did not return a CSV for " + id);
  }
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    const comma = line.indexOf(",");
    if (comma < 0) continue;
    const date = line.slice(0, comma).replace(/"/g, "").trim();
    const raw = line.slice(comma + 1).replace(/"/g, "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!raw || raw === ".") continue;
    const value = cleanNumber(raw);
    if (value == null) continue;
    rows.push({ date, value });
  }
  if (!rows.length) throw new Error("No observations for " + id);
  return rows;
}

async function fetchCsv(id) {
  const url =
    "https://fred.stlouisfed.org/graph/fredgraph.csv?id=" +
    encodeURIComponent(id) +
    "&cosd=" +
    OBSERVATION_START;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/csv,text/plain,*/*",
        },
      });
      if (!response.ok) throw new Error("HTTP " + response.status + " for " + id);
      return parseCsv(await response.text(), id);
    } catch (error) {
      lastError = error;
      await new Promise(function (resolve) {
        setTimeout(resolve, 400 * attempt);
      });
    }
  }
  throw lastError;
}

function elementText(block, name) {
  const pattern = new RegExp(
    "<(?:[A-Za-z0-9_.-]+:)?" +
      name +
      "(?:\\s[^>]*)?>([^<]*)</(?:[A-Za-z0-9_.-]+:)?" +
      name +
      ">",
    "i"
  );
  const match = block.match(pattern);
  return match ? match[1].trim() : "";
}

export function treasuryMonthUrl(now) {
  const date = now instanceof Date ? now : new Date(now);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return TREASURY_XML + date.getUTCFullYear() + month;
}

export function parseTreasuryXml(text) {
  const xml = String(text || "");
  if (!xml || /<html|access denied|just a moment/i.test(xml.slice(0, 500))) return [];
  const sessions = [];
  const entryPattern = /<entry\b[\s\S]*?<\/entry>/gi;
  let match = entryPattern.exec(xml);
  while (match) {
    const block = match[0];
    const date = elementText(block, "NEW_DATE").slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const values = {};
      Object.keys(TREASURY_FIELDS).forEach(function (id) {
        const value = cleanNumber(elementText(block, TREASURY_FIELDS[id]));
        if (value == null) return;
        values[id] = value;
      });
      if (Object.keys(values).length) sessions.push({ date: date, values: values });
    }
    match = entryPattern.exec(xml);
  }
  return sessions;
}

export async function fetchTreasurySessions(options) {
  const settings = options || {};
  const fetchImpl = settings.fetchImpl || fetch;
  const url = treasuryMonthUrl(settings.now || new Date());
  try {
    const response = await fetchImpl(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/xml,text/xml,*/*",
      },
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const text = await response.text();
    if (!text || /<html|access denied|just a moment/i.test(String(text).slice(0, 500))) {
      throw new Error("Treasury did not return XML");
    }
    return parseTreasuryXml(text);
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    console.log("Treasury yield curve unavailable (" + message + "). Keeping FRED observations.");
    return [];
  }
}

export function mergeTreasuryRows(rowsById, sessions) {
  const source = rowsById || {};
  const next = {};
  Object.keys(source).forEach(function (id) {
    next[id] = (source[id] || []).map(function (row) {
      return { date: row.date, value: row.value };
    });
  });
  if (!sessions || !sessions.length) return next;

  Object.keys(TREASURY_FIELDS).forEach(function (id) {
    const rows = next[id];
    if (!rows || !rows.length) return;
    const fredDates = new Set(
      rows.map(function (row) {
        return row.date;
      })
    );
    const extra = new Map();
    sessions.forEach(function (session) {
      if (!session || !/^\d{4}-\d{2}-\d{2}$/.test(session.date || "")) return;
      if (fredDates.has(session.date)) return;
      const raw = session.values ? session.values[id] : null;
      const value = cleanNumber(raw);
      if (value == null) return;
      extra.set(session.date, value);
    });
    extra.forEach(function (value, date) {
      rows.push({ date: date, value: value });
    });
    rows.sort(function (a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  });
  return next;
}

export function seriesPayload(rows) {
  const history = rows.slice(-HISTORY_LIMIT);
  const latest = history[history.length - 1];
  return {
    value: latest.value,
    date: latest.date,
    history,
  };
}

export function canonical(series) {
  const out = {};
  SERIES.forEach(function (id) {
    const row = series[id];
    if (!row) return;
    out[id] = {
      value: row.value,
      date: row.date,
      history: (row.history || []).map(function (point) {
        return { date: point.date, value: point.value };
      }),
    };
  });
  return out;
}

async function main() {
  const rowsById = {};
  for (let i = 0; i < SERIES.length; i += 1) {
    const id = SERIES[i];
    rowsById[id] = await fetchCsv(id);
  }

  const sessions = await fetchTreasurySessions();
  if (sessions.length) {
    const first = sessions[0];
    const last = sessions[sessions.length - 1];
    console.log("Treasury yield curve " + sessions.length + " sessions " + first.date + " through " + last.date);
  }
  const merged = mergeTreasuryRows(rowsById, sessions);

  const series = {};
  for (let i = 0; i < SERIES.length; i += 1) {
    const id = SERIES[i];
    series[id] = seriesPayload(merged[id]);
    const latest = series[id];
    console.log(id + " " + latest.value + " " + latest.date + " (" + latest.history.length + " points)");
  }

  const next = {
    source: "https://fred.stlouisfed.org/graph/fredgraph.csv",
    series: canonical(series),
  };
  const nextText = JSON.stringify(next, null, 2) + "\n";
  if (process.argv.indexOf("--dry-run") !== -1) {
    console.log("Dry run. Left " + path.relative(root, outFile) + " unchanged.");
    return;
  }

  let previousText = "";
  try {
    previousText = fs.readFileSync(outFile, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  if (previousText) {
    try {
      const previous = JSON.parse(previousText);
      if (JSON.stringify(canonical(previous.series || {})) === JSON.stringify(next.series)) {
        console.log("Rates unchanged. Left " + path.relative(root, outFile) + " as it is.");
        return;
      }
    } catch (error) {
      console.log("Existing rates file is not comparable JSON. Rewriting it.");
    }
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, nextText);
  console.log("Wrote " + path.relative(root, outFile));
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  main().catch(function (error) {
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  });
}
