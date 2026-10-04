// gigs.js: reads gigs from your Google Sheet and draws them. No need to edit.
(function () {
  const S = window.SITE || {};
  const U = window.SiteUtil;
  const $ = (id) => document.getElementById(id);
  const CACHE_KEY = "projector_site_v1";

  // ---- CSV ----
  function parseCSV(t) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  function fromCSV(text) {
    const rows = parseCSV(text).filter((r) => r.some((c) => c.trim()));
    if (!rows.length) return null;
    const head = rows[0].map((h) => h.trim().toLowerCase());
    if (head.indexOf("date") < 0) return null; // not our sheet (e.g. a login page)
    const get = (r, n) => { const i = head.indexOf(n); return i > -1 ? (r[i] || "").trim() : ""; };
    const gigs = [], settings = {};
    rows.slice(1).forEach((r) => {
      const d = U.parseDate(get(r, "date"));
      if (d) gigs.push({ date: iso(d), venue: get(r, "venue"), doors: get(r, "doors"), lineup: get(r, "lineup"),
        free: U.isTrue(get(r, "free")), tickets: get(r, "tickets") });
      const k = get(r, "setting");
      if (k) settings[k.toLowerCase()] = get(r, "value");
    });
    return { gigs, settings };
  }

  // ---- drawing ----
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const dateOf = (g) => U.parseDate(g.date);

  // "Event name // Band, Band, projector." (projector. is always put last)
  function formatLineup(raw) {
    raw = (raw || "").trim();
    if (!raw) return "";
    let title = "", bands = raw;
    const m = raw.match(/^(.*?)\s*(?:\/\/|\|)\s*(.*)$/);
    if (m) { title = m[1].trim(); bands = m[2].trim(); }
    let list = bands.split(/\s*,\s*|\s+\/\s+|\s+\+\s+/).filter(Boolean).map((b) => (/^projector\.?$/i.test(b) ? "projector." : b));
    const mine = list.filter((b) => b === "projector.");
    list = list.filter((b) => b !== "projector.").concat(mine);
    const text = list.join(", ");
    return title ? (text ? title + " // " + text : title) : text;
  }

  function actions(g) {
    const box = el("div", "gig-actions");
    if (g.free) box.appendChild(el("span", "badge badge-free", "Free entry"));
    const url = U.safeUrl(g.tickets);
    if (url) { const a = el("a", "gig-ticket-link", g.free ? "Free tickets \u2192" : "Tickets \u2192"); a.href = url; a.target = "_blank"; a.rel = "noopener"; box.appendChild(a); }
    return box.children.length ? box : null;
  }

  function gigCard(g) {
    const d = dateOf(g);
    const card = el("div", "gig-card");
    const date = el("span", "gig-date", d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }));
    date.appendChild(el("small", "", String(d.getFullYear())));
    const info = el("div", "gig-info");
    info.appendChild(el("div", "gig-venue-name", g.venue));
    const sub = formatLineup(g.lineup);
    if (sub) info.appendChild(el("div", "gig-venue", sub));
    card.append(date, info);
    const a = actions(g); if (a) card.appendChild(a);
    return card;
  }

  function fill(id, items, build, emptyMsg) {
    const box = $(id); if (!box) return;
    box.innerHTML = "";
    if (!items.length && emptyMsg) { box.appendChild(el("p", "loading", emptyMsg)); return; }
    items.forEach((g) => box.appendChild(build(g)));
  }

  function render(data) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const up = data.gigs.filter((g) => dateOf(g) >= today).sort((a, b) => dateOf(a) - dateOf(b));
    const past = data.gigs.filter((g) => dateOf(g) < today).sort((a, b) => dateOf(b) - dateOf(a));

    fill("upcoming-gigs", up, gigCard, "No upcoming shows announced. Check back soon.");
    fill("past-gigs", past, gigCard);
    fill("gig-preview", up.slice(0, 3), gigCard, "No upcoming shows right now.");
    if (window.updateRiddles) window.updateRiddles(data.settings);
  }

  // ---- load: show saved copy instantly, then refresh from the sheet ----
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) {}
  const fallback = { gigs: (S.fallbackGigs || []).map((g) => Object.assign({ free: false }, g)), settings: {} };

  if (cached && cached.gigs) render(cached);
  if (!S.sheetCsvUrl) { render(fallback); return; }

  const url = S.sheetCsvUrl + (S.sheetCsvUrl.includes("?") ? "&" : "?") + "t=" + Math.floor(Date.now() / 60000);
  fetch(url, { cache: "no-store" })
    .then((r) => { if (!r.ok) throw new Error("bad response"); return r.text(); })
    .then((t) => {
      const data = fromCSV(t);
      if (!data) throw new Error("not the gigs sheet");
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
      render(data);
    })
    .catch(() => { if (!cached) render(fallback); });
})();
