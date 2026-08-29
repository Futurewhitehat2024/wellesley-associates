(function () {
  const grid = document.getElementById("news-grid");
  const updated = document.getElementById("news-updated");
  const refresh = document.getElementById("news-refresh");
  if (!grid) return;

  const CACHE_KEY = "wa-news-v3-finance";
  const CACHE_MS = 20 * 60 * 1000;

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

  function isFinanceOnly(title, summary) {
    const text = title + " " + summary;
    if (BLOCK.test(text)) return false;
    return ALLOW.test(text);
  }

  function classify(title, baseTags) {
    const tags = new Set(baseTags);
    Object.keys(KEYWORDS).forEach(function (key) {
      if (KEYWORDS[key].test(title)) tags.add(key);
    });
    return Array.from(tags);
  }

  function parseRss(xmlText, source, baseTags) {
    const doc = new DOMParser().parseFromString(xmlText, "text/xml");
    if (doc.querySelector("parsererror")) return [];
    return Array.from(doc.querySelectorAll("item")).slice(0, 10).map(function (item) {
      const title = (item.querySelector("title") || {}).textContent || "";
      const link = (item.querySelector("link") || {}).textContent || "";
      const date = (item.querySelector("pubDate") || item.querySelector("dc\\:date") || {}).textContent || "";
      const summary = strip((item.querySelector("description") || {}).textContent || "");
      return {
        title: title.trim(),
        link: link.trim(),
        date: date,
        summary: summary,
        source: source,
        tags: classify(title + " " + summary, baseTags),
      };
    }).filter(function (item) {
      return item.title && item.link && isFinanceOnly(item.title, item.summary);
    });
  }

  function strip(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").replace(/\s+/g, " ").trim().slice(0, 180);
  }

  async function fetchText(url) {
    const proxies = [
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(url),
      "https://corsproxy.io/?" + encodeURIComponent(url),
    ];
    let lastError;
    for (const proxy of proxies) {
      try {
        const res = await fetch(proxy, { cache: "no-store" });
        if (!res.ok) throw new Error(res.status);
        return await res.text();
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("Feed unavailable");
  }

  async function loadFeeds() {
    const cached = readCache();
    if (cached) {
      render(cached.items, cached.when);
      return;
    }
    grid.innerHTML = '<p class="form-note">Loading live headlines…</p>';
    const results = await Promise.allSettled(
      FEEDS.map(async function (feed) {
        const xml = await fetchText(feed.rss);
        return parseRss(xml, feed.source, feed.tags);
      })
    );
    const items = [];
    results.forEach(function (result) {
      if (result.status === "fulfilled") items.push.apply(items, result.value);
    });
    items.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    const unique = dedupe(items).slice(0, 24);
    const when = Date.now();
    writeCache({ when: when, items: unique });
    render(unique, when);
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

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.when || Date.now() - data.when > CACHE_MS) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {}
  }

  function timeLabel(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recent";
    const diff = Date.now() - date.getTime();
    const hours = Math.round(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return hours + "h ago";
    const days = Math.round(hours / 24);
    if (days < 7) return days + "d ago";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  let currentItems = [];
  let currentFilter = "all";

  function render(items, when) {
    currentItems = items;
    if (updated) {
      updated.textContent = items.length
        ? "Updated " + new Date(when).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : "Live feeds are briefly unavailable. Refresh in a moment.";
    }
    paint();
  }

  function paint() {
    const filtered = currentItems.filter(function (item) {
      return currentFilter === "all" || item.tags.indexOf(currentFilter) !== -1;
    });
    if (!filtered.length) {
      grid.innerHTML = '<p class="form-note">No headlines in this category right now. Try All or refresh.</p>';
      return;
    }
    grid.innerHTML = filtered
      .map(function (item) {
        return (
          '<article class="news-card">' +
          '<p class="news-meta"><span>' +
          escapeHtml(item.source) +
          "</span><span>" +
          escapeHtml(timeLabel(item.date)) +
          "</span></p>" +
          '<h3><a href="' +
          escapeHtml(item.link) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(item.title) +
          "</a></h3>" +
          (item.summary ? "<p>" + escapeHtml(item.summary) + "</p>" : "") +
          "</article>"
        );
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.querySelectorAll(".filter-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (other) {
        other.classList.remove("is-active");
      });
      button.classList.add("is-active");
      currentFilter = button.getAttribute("data-filter");
      paint();
    });
  });

  if (refresh) {
    refresh.addEventListener("click", function () {
      localStorage.removeItem(CACHE_KEY);
      loadFeeds();
    });
  }

  loadFeeds();
})();
