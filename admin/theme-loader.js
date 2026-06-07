// Noxta — runtime theme loader.
// Fetches the theme JSON and applies the colors to CSS custom properties
// on <html>. Variable names match what every page's inline :root block
// already defines, so any hard-coded value gets overridden at runtime.
// Runs early (before paint) to avoid flash.
//
// Szabina patch: theme JSON lives at /data/theme.json, not /content/theme.json.

(async function () {
  let t;
  try {
    const res = await fetch("/data/theme.json?v=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return;
    t = await res.json();
  } catch (_) { return; }
  if (!t || typeof t !== "object") return;

  // Expose for any consumer (live-edit overlay etc.) that wants to react.
  window.__THEME__ = t;

  // Observer is initialized BEFORE first apply() so apply() can safely
  // disconnect/reconnect to avoid an infinite mutation loop.
  let obs = null;
  try {
    obs = new MutationObserver(() => apply(t));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
  } catch (_) { /* observer optional */ }

  // Apply once now, again after React mounts (each page has a useEffect
  // that resets --accent-solid from its own ACCENTS preset on mount —
  // we win the race by re-applying afterward).
  apply(t);
  setTimeout(() => apply(t), 50);
  setTimeout(() => apply(t), 250);
  setTimeout(() => apply(t), 800);

  function apply(t) {
    if (obs) obs.disconnect();
    const r = document.documentElement;
    // Szabina patch: direct mapping for her editorial palette.
    const map = ["bg", "paper", "ink", "ink-soft", "muted", "terra", "terra-deep"];
    for (const k of map) {
      if (t[k]) r.style.setProperty("--" + k, t[k]);
    }
    if (obs) obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
  }
})();
