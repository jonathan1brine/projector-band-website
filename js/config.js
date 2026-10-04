// config.js: the only settings file. Most things live in the Google Sheet now.
window.SITE = {
  // 1. Paste the "Publish to web" CSV link for your "website" tab between the quotes.
  //    Until you do, the site shows the gigs listed in fallbackGigs below.
  sheetCsvUrl: "",

  // 2. Backup riddles settings (the sheet's "website" tab overrides these).
  riddles: { releaseDate: "2026-10-23", presaveUrl: "", listenUrl: "" },

  // 3. Spotify artist link (add once the profile exists). Used for the footer and the LISTEN button.
  spotifyUrl: "",

  // 4. Email signup: your Buttondown username. Leave "" to hide the signup box.
  buttondownUser: "",

  // 5. Optional photo next to the bio, e.g. "images/about.jpg". Leave "" for text only.
  aboutPhoto: "",

  // 6. Photo gallery at the bottom of the home page. Put photos in images/gallery/ and change the file names
  //    and alt text below. Missing files are skipped. (Credit is in the footer: all photos by Orlando Primaro.)
  gallery: [
    { src: "images/gallery/photo-01.jpg", alt: "projector." },
    { src: "images/gallery/photo-02.jpg", alt: "projector. live" },
    { src: "images/gallery/photo-03.jpg", alt: "projector." },
  ],

  // Only used if the sheet can't be loaded and nothing is saved in the visitor's browser.
  fallbackGigs: [
    { date: "2026-10-23", venue: "Grace Emily Hotel", lineup: "Riddles Single Launch // COVE, South Coast, projector.", free: true },
    { date: "2026-10-23", venue: "Unibar", lineup: "Future Sounds Festival", free: true, tickets: "https://moshtix.com.au/v2/event/future-sounds-2026-i-a-free-entry-all-ages-festival-of-new-sa-music/199720" },
    { date: "2026-10-24", venue: "The Exeter", lineup: "Halloween Show // Shopkeeper, Soul Keepers, projector.", free: true },
    { date: "2026-10-03", venue: "The Ed Castle", lineup: "Wasting Time Single Launch // barrelhead, Liquid Mercury, projector.", tickets: "https://moshtix.com.au/v2/event/barrelhead-wasting-time-single-launch/200093" },
    { date: "2026-09-16", venue: "The Ed Castle", lineup: "The Stubbies, COVE, Jaded Earth, projector." },
    { date: "2026-08-22", venue: "Rhino Room", lineup: "Shopkeeper, The Empty Heads, projector." },
    { date: "2026-08-07", venue: "The Gov Upstairs", lineup: "Sunday, Rusthaven, bluehour, projector." },
    { date: "2026-07-24", venue: "The Gov Upstairs", lineup: "Sugar Tongue, Sunday, The Stubbies, projector." },
    { date: "2026-05-29", venue: "The Gov Upstairs", lineup: "Space Coyote, Carr Accident, Shopkeeper, projector." },
    { date: "2026-05-21", venue: "Lowlife Bar", lineup: "Debut Gig // bluehour, Goldfish, projector." }
  ]
};
