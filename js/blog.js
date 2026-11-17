(function () {
  const grid = document.getElementById("news-grid");
  const updated = document.getElementById("news-updated");
  const refresh = document.getElementById("news-refresh");
  if (!grid) return;

  const CACHE_KEY = "wa-news-v4-static";
  const CACHE_MS = 20 * 60 * 1000;

  function newsUrl() {
    return new URL("../data/news.json", window.location.href);
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.when || Date.now() - data.when > CACHE_MS) return null;
      if (!Array.isArray(data.items) || !data.items.length) return null;
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

  function usable(item) {
    if (!item || !item.title || !item.link) return false;
    try {
      const url = new URL(item.link, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (err) {
      return false;
    }
  }

  function normalize(item) {
    const url = new URL(item.link, window.location.href);
    return {
      title: String(item.title),
      link: url.href,
      source: String(item.source || "News"),
      date: item.date || "",
      summary: item.summary ? String(item.summary) : "",
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
    };
  }

  async function loadFeeds() {
    const cached = readCache();
    if (cached) {
      render(cached.items, cached.when);
      return;
    }
    grid.innerHTML = '<p class="form-note">Loading live headlines…</p>';
    try {
      const res = await fetch(newsUrl().href, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const items = (Array.isArray(data.items) ? data.items : []).filter(usable).map(normalize);
      const when = data.updated ? Date.parse(data.updated) : Date.now();
      writeCache({ when: Number.isNaN(when) ? Date.now() : when, items: items });
      render(items, Number.isNaN(when) ? Date.now() : when);
    } catch (err) {
      render([], Date.now());
    }
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
        : "Headlines are temporarily unavailable.";
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
