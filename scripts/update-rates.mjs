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

function cleanNumber(raw) {
  const value = Number(String(raw).trim());
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 10000) / 10000;
}

function parseCsv(text, id) {
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

function seriesPayload(rows) {
  const history = rows.slice(-HISTORY_LIMIT);
  const latest = history[history.length - 1];
  return {
    value: latest.value,
    date: latest.date,
    history,
  };
}

function canonical(series) {
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
  const series = {};
  for (let i = 0; i < SERIES.length; i += 1) {
    const id = SERIES[i];
    const rows = await fetchCsv(id);
    series[id] = seriesPayload(rows);
    const latest = series[id];
    console.log(id + " " + latest.value + " " + latest.date + " (" + latest.history.length + " points)");
  }

  const next = {
    source: "https://fred.stlouisfed.org/graph/fredgraph.csv",
    series: canonical(series),
  };
  const nextText = JSON.stringify(next, null, 2) + "\n";

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

main().catch(function (error) {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
