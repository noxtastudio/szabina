// One-off: pull STORIES from Travel.html / Portrait.html into data/*.json.
// Adds an `images` array (derived from count) so the JSON is the future source of truth.
// Run from repo root:  node scripts/extract-stories.js
const fs = require('fs');
const path = require('path');

function extract(filepath) {
  const html = fs.readFileSync(filepath, 'utf8');
  const match = html.match(/const STORIES = (\[[\s\S]*?\n  \]);/);
  if (!match) throw new Error('STORIES array not found in ' + filepath);
  // Safe eval: we're reading our own committed data file
  const STORIES = eval(match[1]);
  return STORIES.map(s => {
    const ext1 = s.coverExt || 'webp';   // slot 1 is .webp on s01–s12, .jpg on everything else
    const images = [`1.${ext1}`];
    for (let n = 2; n <= s.count; n++) images.push(`${n}.jpg`);
    return { ...s, images };
  });
}

const travel = extract(path.join(__dirname, '..', 'Travel.html'));
const portrait = extract(path.join(__dirname, '..', 'Portrait.html'));

const outDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'travel.json'), JSON.stringify(travel, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'portrait.json'), JSON.stringify(portrait, null, 2) + '\n');

console.log(`Wrote data/travel.json (${travel.length} stories)`);
console.log(`Wrote data/portrait.json (${portrait.length} stories)`);
