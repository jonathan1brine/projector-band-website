// gigs.js — Edit the GIGS array to add/remove shows
// Date format: "YYYY-MM-DD"

const GIGS = [
  // ---- UPCOMING ----
  // Add upcoming gigs here like this:
  // {
  //   date: "2025-07-12",
  //   venue: "The Gov",
  //   city: "Adelaide, SA",
  //   event: "Friday Night Live",
  //   ticketUrl: "https://yourticketlink.com",
  // },

  // ---- PAST ----
  {
    date: "2025-05-29",
    venue: "The Gov Upstairs",
    city: "Adelaide, SA",
    event: "Space Coyote / Carr Accident / Shopkeeper / Projector",
    ticketUrl: null,
  },
  {
    date: "2025-05-21",
    venue: "Lowlife Bar",
    city: "Adelaide, SA",
    event: "Blue Hour // Projector // Goldfish, Debut Gig",
    ticketUrl: null,
  },
];

// ---- Rendering — you don't need to touch anything below this line ----

function isUpcoming(dateStr) {
  const gigDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return gigDate >= today;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildGigCard(gig) {
  const card = document.createElement("div");
  card.className = "gig-card";

  const dateEl = document.createElement("span");
  dateEl.className = "gig-date";
  dateEl.textContent = formatDate(gig.date);

  const info = document.createElement("div");
  info.className = "gig-info";

  const venueName = document.createElement("div");
  venueName.className = "gig-venue-name";
  venueName.textContent = gig.venue;

  const venue = document.createElement("div");
  venue.className = "gig-venue";
  venue.textContent = `${gig.city}${gig.event ? ", " + gig.event : ""}`;

  info.appendChild(venueName);
  info.appendChild(venue);
  card.appendChild(dateEl);
  card.appendChild(info);

  if (gig.ticketUrl) {
    const link = document.createElement("a");
    link.href = gig.ticketUrl;
    link.target = "_blank";
    link.className = "gig-ticket-link";
    link.textContent = "Tickets →";
    card.appendChild(link);
  }

  return card;
}

function renderGigs() {
  const upcoming = GIGS.filter((g) => isUpcoming(g.date)).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const past = GIGS.filter((g) => !isUpcoming(g.date)).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Full gigs page
  const upcomingEl = document.getElementById("upcoming-gigs");
  const pastEl = document.getElementById("past-gigs");

  if (upcomingEl) {
    if (upcoming.length === 0) {
      upcomingEl.innerHTML = '<p class="loading">No upcoming shows announced. Check back soon.</p>';
    } else {
      upcoming.forEach((g) => upcomingEl.appendChild(buildGigCard(g)));
    }
  }

  if (pastEl) {
    past.forEach((g) => pastEl.appendChild(buildGigCard(g)));
  }

  // Homepage preview (shows next 2 upcoming)
  const previewEl = document.getElementById("gig-preview");
  if (previewEl) {
    previewEl.innerHTML = "";
    if (upcoming.length === 0) {
      previewEl.innerHTML = '<p class="loading">No upcoming shows right now.</p>';
    } else {
      upcoming.slice(0, 2).forEach((g) => previewEl.appendChild(buildGigCard(g)));
    }
  }
}

renderGigs();