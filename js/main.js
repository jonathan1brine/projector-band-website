// main.js: site-wide JS (nav, riddles block, photos, email signup). No need to edit.
(function () {
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");

  // ---- shared helpers (also used by gigs.js) ----
  function parseDate(s) {
    s = (s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); // d/m/yyyy (Australia)
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    return null;
  }
  const isTrue = (v) => v === true || /^(true|yes|y|1)$/i.test(String(v || "").trim());
  const safeUrl = (u) => (/^https?:\/\//i.test((u || "").trim()) ? u.trim() : "");
  window.SiteUtil = { parseDate, isTrue, safeUrl };

  // ---- mobile nav ----
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }
  if ($("year")) $("year").textContent = new Date().getFullYear();

  // ---- riddles block (pre-save flips to listen by itself on release day) ----
  window.updateRiddles = function (settings) {
    if (!$("riddles")) return;
    const s = settings || {};
    const base = S.riddles || {};
    const rd = parseDate(s.release_date) || parseDate(base.releaseDate);
    const presave = safeUrl(s.presave_url) || safeUrl(base.presaveUrl);
    const listen = safeUrl(s.listen_url) || safeUrl(base.listenUrl) || safeUrl(S.spotifyUrl);
    let released = false, longDate = "23 october", shortDate = "23 Oct";
    if (rd) {
      // release goes live at midnight Adelaide time (ACDT, +10:30)
      const iso = `${rd.getFullYear()}-${pad(rd.getMonth() + 1)}-${pad(rd.getDate())}T00:00:00+10:30`;
      released = Date.now() >= new Date(iso).getTime();
      longDate = rd.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" }).replace(",", "").toLowerCase();
      shortDate = rd.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    }
    $("riddles-eyebrow").textContent = released ? "our debut single \u00b7 out now" : `our debut single \u00b7 out ${longDate}`;
    const url = released ? listen || presave : presave;
    const label = released ? "Listen to Riddles" : "Pre-save Riddles";
    document.querySelectorAll("[data-riddles-btn]").forEach((b) => {
      const hero = b.dataset.riddlesBtn === "hero";
      if (url) {
        b.href = url; b.target = "_blank"; b.rel = "noopener"; b.textContent = label; b.hidden = false;
      } else if (hero) {
        b.href = "#riddles"; b.removeAttribute("target"); b.textContent = released ? "Riddles" : `Riddles \u00b7 out ${shortDate}`; b.hidden = false;
      } else b.hidden = true;
    });
    if ($("riddles-soon")) $("riddles-soon").hidden = !!url || released;
  };
  window.updateRiddles({});

  // ---- photos ----
  const grid = $("gallery-grid");
  if (grid) {
    const photos = S.gallery || [];
    const section = $("photos");
    if (!photos.length) section.hidden = true;
    photos.forEach((p) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = p.src; img.alt = p.alt || "projector."; img.loading = "lazy";
      img.onerror = () => { fig.remove(); if (!grid.children.length) section.hidden = true; };
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  // ---- about photo ----
  if (S.aboutPhoto && $("about-photo")) {
    const img = $("about-photo");
    img.src = S.aboutPhoto; img.hidden = false;
    img.parentElement.classList.add("has-photo");
  }

  // ---- email signup (Buttondown) ----
  const form = $("signup-form");
  if (form) {
    if (!S.buttondownUser) { $("signup").hidden = true; }
    else {
      form.action = `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(S.buttondownUser)}`;
      form.target = "popupwindow";
      form.addEventListener("submit", () => window.open(`https://buttondown.com/${encodeURIComponent(S.buttondownUser)}`, "popupwindow"));
    }
  }

  // ---- spotify link in footer ----
  if (safeUrl(S.spotifyUrl) && $("footer-spotify")) { $("footer-spotify").href = S.spotifyUrl; $("footer-spotify").hidden = false; }
})();
