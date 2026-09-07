/* Asserts the SEO surface of a RUNNING build: JSON-LD parses and its @id graph
   resolves, canonicals, titles and descriptions are present and within Google's
   snippet limits, the share card is a format every client renders, one h1 per
   page, every img has alt, and robots/sitemap/llms.txt say what they should.

   Usage:  npx next build && npx next start -p 3555
           node scripts/seo-check.mjs        (or: node scripts/seo-check.mjs http://localhost:3000)

   Exits non-zero on any failure, so it can gate a deploy. */
const BASE = process.argv[2] ?? "http://localhost:3555";
const ROUTES = ["/", "/about", "/explore", "/contact", "/privacy", "/terms", "/cookies"];

let fail = 0;
const bad = (m) => { console.log("  FAIL " + m); fail++; };
const ok = (m) => console.log("  ok   " + m);

const ids = new Map(); // @id -> where defined
const refs = [];       // {id, where}

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  const html = await res.text();
  console.log(`\n=== ${route} (${res.status}) ===`);

  // ── JSON-LD: must all parse ──
  const blocks = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )].map((m) => m[1]);
  let nodes = [];
  for (const b of blocks) {
    try { nodes.push(JSON.parse(b)); }
    catch (e) { bad(`JSON-LD does not parse: ${e.message}`); }
  }
  ok(`${blocks.length} JSON-LD blocks, all parse`);
  console.log("       types: " + nodes.map((n) => n["@type"]).join(", "));

  // collect @ids and references for the cross-page graph check
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    for (const [k, v] of Object.entries(o)) {
      if (k === "@id" && typeof v === "string") {
        if (o["@type"]) ids.set(v, route);           // a definition
        else refs.push({ id: v, where: route });      // a bare reference
      }
      walk(v);
    }
  };
  nodes.forEach(walk);

  // ── canonical, robots, title, description ──
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  canon ? ok(`canonical ${canon}`) : bad("no canonical");

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  title ? ok(`title "${title}" (${title.length} chars)`) : bad("no <title>");
  if (title && title.length > 65) bad(`title ${title.length} chars — Google truncates past ~60`);

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) bad("no meta description");
  else {
    ok(`description ${desc.length} chars`);
    if (desc.length > 165) bad(`description ${desc.length} chars — truncates past ~160`);
  }

  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1];
  if (!robots) bad("no robots meta");
  else if (/noindex/.test(robots)) bad(`ROBOTS SAYS NOINDEX: ${robots}`);
  else ok(`robots ${robots}`);

  // ── share card ──
  const ogImg = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!ogImg) bad("no og:image");
  else if (/\.webp$/i.test(ogImg)) bad(`og:image is WebP (${ogImg}) — X/LinkedIn drop it`);
  else ok(`og:image ${ogImg}`);

  // og:image must actually resolve
  if (ogImg) {
    const r = await fetch(ogImg.startsWith("http") ? ogImg.replace(/^https?:\/\/[^/]+/, BASE) : BASE + ogImg);
    r.ok ? ok(`og:image resolves (${r.status}, ${r.headers.get("content-type")})`)
         : bad(`og:image 404s: ${ogImg}`);
  }

  // ── headings ──
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  if (h1.length === 1) ok(`one h1: "${h1[0].slice(0, 60)}"`);
  else bad(`${h1.length} h1 elements (want exactly 1)`);

  // ── images ──
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt=/.test(t));
  noAlt.length ? bad(`${noAlt.length}/${imgs.length} <img> without alt`)
               : ok(`all ${imgs.length} <img> have alt`);
}

// ── robots.txt & sitemap ──
console.log("\n=== /robots.txt ===");
const rt = await fetch(BASE + "/robots.txt").then((r) => r.text());
for (const a of ["Google-Extended", "GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"])
  rt.includes(a) ? ok(`${a} named`) : bad(`${a} missing`);
rt.includes("Sitemap:") ? ok("sitemap line present") : bad("no sitemap line");
if (/Disallow:\s*\/\s*$/m.test(rt)) bad("a rule disallows the whole site");

console.log("\n=== /sitemap.xml ===");
const sm = await fetch(BASE + "/sitemap.xml").then((r) => r.text());
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok(`${locs.length} urls: ${locs.join(" ")}`);
for (const r of ROUTES) {
  const want = r === "/" ? "/" : r;
  locs.some((l) => new URL(l).pathname === want) ? ok(`${want} in sitemap`) : bad(`${want} MISSING from sitemap`);
}

console.log("\n=== /llms.txt ===");
const lr = await fetch(BASE + "/llms.txt");
lr.ok ? ok(`llms.txt ${lr.status}`) : bad("llms.txt missing");

// ── graph integrity: every bare @id reference must be defined somewhere ──
console.log("\n=== JSON-LD graph ===");
ok(`${ids.size} nodes with @id defined`);
const dangling = refs.filter((r) => !ids.has(r.id));
if (dangling.length) {
  for (const d of [...new Set(dangling.map((d) => d.id + "  (ref from " + d.where + ")"))])
    bad(`@id referenced but never defined: ${d}`);
} else ok(`all ${refs.length} @id references resolve`);

console.log(fail ? `\n${fail} PROBLEM(S)\n` : "\nAll checks passed\n");
process.exit(fail ? 1 : 0);
