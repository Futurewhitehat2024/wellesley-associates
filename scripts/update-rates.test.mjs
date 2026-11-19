import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  canonical,
  fetchTreasurySessions,
  mergeTreasuryRows,
  parseCsv,
  parseTreasuryXml,
  seriesPayload,
  treasuryMonthUrl,
} from "./update-rates.mjs";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "treasury-yield-curve.xml"
);
const fixtureXml = fs.readFileSync(fixturePath, "utf8");

test("parses current-month Treasury sessions for the matching tenors", function () {
  const sessions = parseTreasuryXml(fixtureXml);
  assert.deepEqual(
    sessions.map(function (session) {
      return session.date;
    }),
    ["2026-11-16", "2026-11-17", "2026-11-18"]
  );
  assert.equal(sessions[0].values.DGS10, 4.91);
  assert.equal(sessions[1].values.DGS10, 5.1);
  assert.equal(sessions[2].values.DGS30, 5.41);
  assert.equal(sessions[2].values.DGS1MO, 4.1);
  assert.equal(Object.hasOwn(sessions[2].values, "DGS2"), false);
  assert.equal(Object.hasOwn(sessions[0].values, "DGS7"), false);
  assert.equal(Object.hasOwn(sessions[0].values, "DGS20"), false);
  assert.deepEqual(Object.keys(sessions[0].values).sort(), [
    "DGS1",
    "DGS10",
    "DGS1MO",
    "DGS2",
    "DGS30",
    "DGS3MO",
    "DGS5",
    "DGS6MO",
  ]);
});

test("prefers FRED on a shared date and appends Treasury-only sessions", function () {
  const sessions = parseTreasuryXml(fixtureXml);
  const fred = {
    DGS10: [
      { date: "2026-11-12", value: 4.5 },
      { date: "2026-11-16", value: 4.11 },
    ],
    FEDFUNDS: [{ date: "2026-10-01", value: 3.88 }],
    DGS2: [{ date: "2026-11-16", value: 4.62 }],
  };
  const before = JSON.stringify(fred);
  const merged = mergeTreasuryRows(fred, sessions);

  assert.equal(before, JSON.stringify(fred));
  assert.deepEqual(merged.DGS10, [
    { date: "2026-11-12", value: 4.5 },
    { date: "2026-11-16", value: 4.11 },
    { date: "2026-11-17", value: 5.1 },
    { date: "2026-11-18", value: 5.07 },
  ]);
  assert.deepEqual(merged.FEDFUNDS, fred.FEDFUNDS);
  assert.deepEqual(merged.DGS2, [
    { date: "2026-11-16", value: 4.62 },
    { date: "2026-11-17", value: 4.8 },
  ]);
  assert.equal(Object.hasOwn(merged, "DGS3MO"), false);
});

test("a later Treasury session for the same new date wins", function () {
  const sessions = [
    { date: "2026-11-18", values: { DGS10: 5.01 } },
    { date: "2026-11-18", values: { DGS10: 5.07 } },
  ];
  const merged = mergeTreasuryRows(
    { DGS10: [{ date: "2026-11-16", value: 4.11 }] },
    sessions
  );
  assert.deepEqual(merged.DGS10, [
    { date: "2026-11-16", value: 4.11 },
    { date: "2026-11-18", value: 5.07 },
  ]);
});

test("keeps FRED rows when Treasury sessions are missing", function () {
  const fred = {
    DGS10: [{ date: "2026-11-16", value: 4.11 }],
    SOFR: [{ date: "2026-11-17", value: 3.92 }],
  };
  assert.deepEqual(mergeTreasuryRows(fred, null), fred);
  assert.deepEqual(mergeTreasuryRows(fred, []), fred);
  assert.deepEqual(mergeTreasuryRows(fred, undefined), fred);
  assert.deepEqual(mergeTreasuryRows({ DGS10: [] }, parseTreasuryXml(fixtureXml)).DGS10, []);
});

test("blocked or empty Treasury XML yields no sessions", function () {
  assert.deepEqual(parseTreasuryXml("<html><title>Just a moment</title></html>"), []);
  assert.deepEqual(parseTreasuryXml(""), []);
  assert.deepEqual(parseTreasuryXml("Access Denied"), []);
});

test("Treasury fetch failure leaves no sessions to merge", async function () {
  const now = new Date("2026-11-19T13:42:00Z");
  const expectedUrl = treasuryMonthUrl(now);
  assert.equal(
    expectedUrl,
    "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value_month=202611"
  );

  const network = await fetchTreasurySessions({
    now: now,
    fetchImpl: async function () {
      throw new Error("network down");
    },
  });
  const http = await fetchTreasurySessions({
    now: now,
    fetchImpl: async function () {
      return { ok: false, status: 503, text: async function () { return ""; } };
    },
  });
  const called = [];
  const parsed = await fetchTreasurySessions({
    now: now,
    fetchImpl: async function (url) {
      called.push(url);
      return { ok: true, text: async function () { return fixtureXml; } };
    },
  });

  assert.deepEqual(network, []);
  assert.deepEqual(http, []);
  assert.deepEqual(called, [treasuryMonthUrl(now, -1), expectedUrl]);
  assert.deepEqual(
    parsed.map(function (session) {
      return session.date;
    }),
    ["2026-11-16", "2026-11-17", "2026-11-18"]
  );
  assert.equal(parsed[parsed.length - 1].date, "2026-11-18");
  assert.deepEqual(
    await fetchTreasurySessions({
      now: now,
      fetchImpl: async function () {
        return {
          ok: true,
          text: async function () {
            return "<html>access denied</html>";
          },
        };
      },
    }),
    []
  );
});

test("merged history keeps the rates.json point schema and the last 90 observations", function () {
  const rows = [];
  const start = Date.UTC(2026, 5, 1);
  for (let i = 0; i < 90; i += 1) {
    rows.push({
      date: new Date(start + i * 86400000).toISOString().slice(0, 10),
      value: i,
    });
  }
  const merged = mergeTreasuryRows(
    { DGS5: rows },
    [{ date: "2026-11-18", values: { DGS5: 4.123456 } }]
  );
  const payload = seriesPayload(merged.DGS5);
  assert.equal(payload.history.length, 90);
  assert.equal(payload.date, "2026-11-18");
  assert.equal(payload.value, 4.1235);
  assert.deepEqual(payload.history[payload.history.length - 1], {
    date: "2026-11-18",
    value: 4.1235,
  });
  const stored = canonical({ DGS5: payload, EXTRA: { value: 1, date: "2026-11-18", history: [] } });
  assert.deepEqual(Object.keys(stored), ["DGS5"]);
  assert.deepEqual(Object.keys(stored.DGS5), ["value", "date", "history"]);
  assert.deepEqual(Object.keys(stored.DGS5.history[0]), ["date", "value"]);
});

function yieldEntry(date, fields) {
  const body = Object.keys(fields)
    .map(function (name) {
      return "<d:" + name + ' m:type="Edm.Double">' + fields[name] + "</d:" + name + ">";
    })
    .join("");
  return (
    '<entry><content type="application/xml"><m:properties>' +
    '<d:NEW_DATE m:type="Edm.DateTime">' +
    date +
    "T00:00:00</d:NEW_DATE>" +
    body +
    "</m:properties></content></entry>"
  );
}

function yieldFeed(entries) {
  return "<feed>" + entries.join("") + "</feed>";
}

test("an empty current month still fills the FRED lag from the previous month", async function () {
  const now = new Date("2026-12-01T11:17:00Z");
  const current = treasuryMonthUrl(now);
  const previous = treasuryMonthUrl(now, -1);
  assert.equal(current.endsWith("=202612"), true);
  assert.equal(previous.endsWith("=202611"), true);
  assert.equal(treasuryMonthUrl(new Date("2026-01-02T21:47:00Z"), -1).endsWith("=202512"), true);

  const urls = [];
  const sessions = await fetchTreasurySessions({
    now: now,
    fetchImpl: async function (url) {
      urls.push(url);
      if (url === current) {
        return { ok: true, text: async function () { return "<feed></feed>"; } };
      }
      return { ok: true, text: async function () { return fixtureXml; } };
    },
  });

  assert.deepEqual(urls, [previous, current]);
  const merged = mergeTreasuryRows(
    {
      DGS10: [
        { date: "2026-11-18", value: 9.99 },
        { date: "2026-11-16", value: 4.11 },
      ],
    },
    sessions
  );
  assert.deepEqual(merged.DGS10, [
    { date: "2026-11-16", value: 4.11 },
    { date: "2026-11-17", value: 5.1 },
    { date: "2026-11-18", value: 9.99 },
  ]);
});

test("a failed current month keeps the previous month, and the later month wins a duplicate date", async function () {
  const now = new Date("2026-12-01T21:47:00Z");
  const current = treasuryMonthUrl(now);
  const previous = treasuryMonthUrl(now, -1);
  const failedCurrent = await fetchTreasurySessions({
    now: now,
    fetchImpl: async function (url) {
      if (url === current) throw new Error("HTTP 503");
      return { ok: true, text: async function () { return fixtureXml; } };
    },
  });
  assert.equal(failedCurrent[0].date, "2026-11-16");
  assert.equal(failedCurrent[failedCurrent.length - 1].date, "2026-11-18");

  const sessions = await fetchTreasurySessions({
    now: now,
    fetchImpl: async function (url) {
      if (url === previous) {
        return {
          ok: true,
          text: async function () {
            return yieldFeed([
              yieldEntry("2026-11-30", { BC_10YEAR: "4.00", BC_2YEAR: "4.20" }),
              yieldEntry("2026-11-28", { BC_10YEAR: "3.00" }),
            ]);
          },
        };
      }
      return {
        ok: true,
        text: async function () {
          return yieldFeed([
            yieldEntry("2026-12-01", { BC_10YEAR: "6.00" }),
            yieldEntry("2026-11-30", { BC_10YEAR: "4.50" }),
          ]);
        },
      };
    },
  });
  assert.deepEqual(sessions, [
    { date: "2026-11-28", values: { DGS10: 3 } },
    { date: "2026-11-30", values: { DGS2: 4.2, DGS10: 4.5 } },
    { date: "2026-12-01", values: { DGS10: 6 } },
  ]);
  const merged = mergeTreasuryRows(
    { DGS10: [{ date: "2026-11-28", value: 9.99 }] },
    sessions
  );
  assert.deepEqual(merged.DGS10, [
    { date: "2026-11-28", value: 9.99 },
    { date: "2026-11-30", value: 4.5 },
    { date: "2026-12-01", value: 6 },
  ]);
});

test("FRED csv parsing still skips blanks and missing observations", function () {
  const rows = parseCsv(
    "observation_date,DGS10\n2026-11-16,4.11\n2026-11-17,.\nnot-a-date,4.2\n2026-11-18,5.07\n",
    "DGS10"
  );
  assert.deepEqual(rows, [
    { date: "2026-11-16", value: 4.11 },
    { date: "2026-11-18", value: 5.07 },
  ]);
});
