/*
  Szabina — Level 3 marker config.

  Scope: ONLY Szabina.html (about page). Portrait.html and Travel.html
  stay managed by admin.html's existing story-editor — their JSON shape
  (rich arrays with HTML entities) doesn't fit live-edit's text-content
  model.

  Targeted text fields, NOT the <h1> (contains <em>) or category cards
  (dynamic). If you want more later, add more rules.
*/

export default {
  pages: [
    {
      file: "Szabina.html",
      collectionId: "szabina",
      contentJson: "data/szabina.json",
      liveEditUrl: "/Szabina.html?edit=1",
      group: "Pages",
      markers: [
        { selector: "section.about .eyebrow", field: "about.eyebrow" },
        { selector: "section.about p.lede",   field: "about.lede", multiline: true },
        // .sig is intentionally NOT marked — it contains <span class="amp">
        // which textContent would strip on save. Also <h1> contains <em>;
        // skipped for the same reason.
      ],
    },
  ],
};
