// Downloads the RSS feeds used by the blog and writes data/news.json.
// No API key. The browser reads this file from the same origin.
// Keep FEEDS, BLOCK, ALLOW, and KEYWORDS aligned with the blog filters.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "data", "news.json");

const FEEDS = [
  {
    source: "Federal Reserve",
    rss: "https://www.federalreserve.gov/feeds/press_all.xml",
    tags: ["rates", "business"],
  },
  {
    source: "HousingWire",
    rss: "https://www.housingwire.com/feed/",
    tags: ["homeowners", "rates"],
  },
  {
    source: "Insurance Journal",
    rss: "https://www.insurancejournal.com/feed/",
    tags: ["insurance", "homeowners", "business"],
  },
  {
    source: "CNBC Economy",
    rss: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258",
    tags: ["rates", "business"],
  },
  {
    source: "CNBC Markets",
    rss: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069",
    tags: ["rates", "business"],
  },
  {
    source: "CNBC Finance",
    rss: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664",
    tags: ["rates", "business"],
  },
];

const BLOCK = /murder|homicide|manslaughter|shooting|shot dead|stabbed|stabbing|killed in|killing of|massacre|rape|sexual assault|child abuse|suicide|beheading|body found|crime scene|serial killer|missing person|abduct|kidnapp|domestic violence|assaulted|gunman|gunmen|active shooter|died after being|fatal crash|wrongful death|fatality|celebrity|oscar|grammy|tmz|true crime/i;

const ALLOW = /federal reserve|fomc|interest rate|inflation|cpi|pce|treasury|yield|mortgage|housing|homeowner|home price|refinance|insurance|premium|underwrit|flood|liability|workers.?comp|cyber|commercial real estate|multifamily|cmbs|sba\b|small business|loan|lending|credit|working capital|equipment financ|line of credit|\bbank|\bbanking|gdp|payroll|jobs report|unemployment|recession|fed funds|prime rate|bond|nasdaq|dow |s&p|stock market|wall street|earnings|oil price|crude|energy price|tariff|dollar|fannie|freddie|fhfa|naic|fema|condo|landlord|policy rate|rate cut|rate hike|origination|delinquenc|default|foreclos|deductible|coverage|reinsur|risk|capital market|private credit|bridge loan|construction loan|commercial loan|business loan|equity market|securit|liquidity|balance sheet|monetary|fiscal|consumer price|housing start|building permit|existing home|new home sales|annuit|myga|spia|fixed income|retirement income/i;

const KEYWORDS = {
  homeowners: /homeowner|housing|mortgage|home price|rent|flood|condo|roof|wildfire|hurricane|fannie|freddie|fhfa|existing home|new home/i,
  business: /small business|sba|credit|loan|lending|working capital|payroll|recession|employment|bank|earnings|gdp/i,
  insurance: /insur|premium|underwrit|liability|flood|cyber|workers.?comp|reinsur|naic|coverage|deductible|term life|whole life/i,
  financial: /annuit|myga|spia|fixed indexed|retirement income|cd rate|money market|401k|ira\b|pension|longevity/i,
  rates: /federal reserve|fomc|interest rate|inflation|cpi|pce|treasury|yield|fed |monetary|rate cut|rate hike|fed funds/i,
  cre: /commercial real estate|multifamily|office|retail|industrial|cmbs|cre |hotel|self-storage|construction loan/i,
};

const USER_AGENT = "Mozilla/5.0 (compatible; WellesleyCollectiveNews/1.0; +https://wellesleycollective.com)";
const PER_FEED = 10;
const MAX_ITEMS = 24;
const SUMMARY_LEN = 180;

function isFinanceOnly(title, summary) {
  const text = title + " " + summary;
  if (BLOCK.test(text)) return false;
  return ALLOW.test(text);
}

function classify(text, baseTags) {
  const tags = new Set(baseTags);
  Object.keys(KEYWORDS).forEach(function (key) {
    if (KEYWORDS[key].test(text)) tags.add(key);
  });
  return Array.from(tags);
}

function decodeEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : _;
    })
    .replace(/&#(\d+);/g, function (_, num) {
      const code = Number(num);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : _;
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&hellip;/g, "\u2026");
}

function unwrap(value) {
  const raw = String(value || "").trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return decodeEntities(cdata ? cdata[1] : raw).trim();
}

function stripHtml(value) {
  return decodeEntities(String(value || ""))
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SUMMARY_LEN);
}

function tagInner(block, tagName) {
  const pattern = new RegExp("<" + tagName + "\\b[^>]*>([\\s\\S]*?)</" + tagName + ">", "i");
  const match = block.match(pattern);
  return match ? match[1] : "";
}

function itemLink(block) {
  const pattern = /<link\b[^>]*>([\s\S]*?)<\/link>/gi;
  let match;
  while ((match = pattern.exec(block))) {
    const href = unwrap(match[1]);
    if (/^https?:\/\//i.test(href)) return href;
  }
  const atom = block.match(/<link\b[^>]*\bhref=["'](https?:\/\/[^"']+)["'][^>]*\/?>/i);
  if (atom) return decodeEntities(atom[1]).trim();
  const guid = unwrap(tagInner(block, "guid"));
  if (/^https?:\/\//i.test(guid)) return guid;
  return "";
}

function itemDate(block) {
  const raw = unwrap(tagInner(block, "pubDate") || tagInner(block, "dc:date") || tagInner(block, "date"));
  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toISOString();
}

function parseRss(xml, feed) {
  const text = String(xml).replace(/^\uFEFF/, "");
  if (/<html|access denied|just a moment|enable javascript/i.test(text.slice(0, 600)) && !/<rss|<feed/i.test(text.slice(0, 600))) {
    throw new Error(feed.source + " did not return RSS");
  }
  const blocks = [];
  const pattern = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = pattern.exec(text))) {
    blocks.push(match[1]);
    if (blocks.length >= PER_FEED) break;
  }
  return blocks
    .map(function (block) {
      const title = stripHtml(unwrap(tagInner(block, "title")));
      const link = itemLink(block);
      const summary = stripHtml(tagInner(block, "description") || tagInner(block, "content:encoded") || "");
      const date = itemDate(block);
      return {
        title: title,
        link: link,
        source: feed.source,
        date: date,
        summary: summary,
        tags: classify(title + " " + summary, feed.tags),
      };
    })
    .filter(function (item) {
      return item.title && /^https?:\/\//i.test(item.link) && isFinanceOnly(item.title, item.summary);
    });
}

async function fetchRss(feed) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(feed.rss, {
        redirect: "follow",
        signal: AbortSignal.timeout(40000),
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
      });
      if (!response.ok) throw new Error("HTTP " + response.status + " for " + feed.source);
      return await response.text();
    } catch (error) {
      lastError = error;
      await new Promise(function (resolve) {
        setTimeout(resolve, 500 * attempt);
      });
    }
  }
  throw lastError;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter(function (item) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function byDateDesc(a, b) {
  return new Date(b.date) - new Date(a.date);
}

function canonicalItem(item) {
  return {
    title: item.title,
    link: item.link,
    source: item.source,
    date: item.date,
    summary: item.summary,
    tags: Array.isArray(item.tags) ? item.tags.slice() : [],
  };
}

function readPrevious() {
  try {
    const parsed = JSON.parse(fs.readFileSync(outFile, "utf8"));
    return Array.isArray(parsed.items) ? parsed.items.map(canonicalItem) : [];
  } catch (error) {
    if (error.code !== "ENOENT") console.log("Existing news file is not usable. Starting fresh.");
    return [];
  }
}

async function main() {
  const previous = readPrevious();
  const collected = [];
  const counts = {};
  let failures = 0;

  for (let i = 0; i < FEEDS.length; i += 1) {
    const feed = FEEDS[i];
    try {
      const xml = await fetchRss(feed);
      const matched = parseRss(xml, feed);
      counts[feed.source] = matched.length;
      collected.push.apply(collected, matched);
      console.log(feed.source + ": " + matched.length + " headlines");
    } catch (error) {
      failures += 1;
      const kept = previous.filter(function (item) {
        return item.source === feed.source;
      });
      counts[feed.source] = kept.length;
      collected.push.apply(collected, kept);
      const reason = error && error.message ? error.message : String(error);
      console.log(feed.source + ": fetch failed (" + reason + "). Kept " + kept.length + " previous headlines.");
    }
  }

  const items = dedupe(collected.sort(byDateDesc)).slice(0, MAX_ITEMS);
  if (!items.length) {
    throw new Error("No headlines collected from any feed.");
  }

  const shown = {};
  FEEDS.forEach(function (feed) {
    shown[feed.source] = items.filter(function (item) {
      return item.source === feed.source;
    }).length;
  });

  const nextItems = items.map(canonicalItem);
  const previousComparable = JSON.stringify(previous.map(canonicalItem));
  const nextComparable = JSON.stringify(nextItems);
  console.log("SHOWING " + JSON.stringify(shown));

  if (previous.length && previousComparable === nextComparable) {
    console.log("Headlines unchanged. Left " + path.relative(root, outFile) + " as it is.");
    if (failures === FEEDS.length) throw new Error("Every feed failed and the saved file was left unchanged.");
    return;
  }

  const next = {
    updated: new Date().toISOString(),
    items: nextItems,
  };
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(next, null, 2) + "\n");
  console.log("Wrote " + path.relative(root, outFile) + " (" + nextItems.length + " headlines)");
}

main().catch(function (error) {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
