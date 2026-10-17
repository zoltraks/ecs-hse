import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Resolve the project root relative to this script so it works from any cwd.
const ROOT = dirname(fileURLToPath(import.meta.url));
const PACKAGE_FILE = join(ROOT, "package.json");
const HTML_FILE = join(ROOT, "index.html");

const META_PATTERN = /<meta name="version" content="[^"]*" ?\/?>/;
const VALUE_PATTERN = /<meta name="version" content="([^"]*)"/;
const VIEWPORT_PATTERN = /(<meta name="viewport"[^>]*>)/;

function bumpVersion(version) {
  const segments = version.split(".").map(Number);
  for (let i = segments.length - 1; i > 0; i--) {
    if (segments[i] < 9) {
      segments[i] += 1;
      return segments.join(".");
    }
    segments[i] = 0;
  }
  segments[0] += 1;
  return segments.join(".");
}

function syncHtml(version) {
  const html = readFileSync(HTML_FILE, "utf8");
  const tag = `<meta name="version" content="${version}">`;
  if (META_PATTERN.test(html)) {
    writeFileSync(HTML_FILE, html.replace(META_PATTERN, tag));
    return;
  }
  if (!VIEWPORT_PATTERN.test(html)) {
    console.error("index.html has no viewport meta tag to anchor the version tag");
    process.exit(1);
  }
  writeFileSync(HTML_FILE, html.replace(VIEWPORT_PATTERN, "$1\n  " + tag));
}

const command = process.argv[2] || "sync";
const pkg = JSON.parse(readFileSync(PACKAGE_FILE, "utf8"));

if (command === "sync") {
  syncHtml(pkg.version);
  console.log(`index.html synchronized to version ${pkg.version}`);
} else if (command === "check") {
  const html = readFileSync(HTML_FILE, "utf8");
  const match = html.match(VALUE_PATTERN);
  const current = match ? match[1] : "none";
  if (current !== pkg.version) {
    console.error(`Version mismatch: package.json has ${pkg.version}, index.html has ${current}`);
    process.exit(1);
  }
  console.log(`Version ${pkg.version} is synchronized`);
} else if (command === "bump") {
  const next = bumpVersion(pkg.version);
  pkg.version = next;
  writeFileSync(PACKAGE_FILE, JSON.stringify(pkg, null, 2) + "\n");
  syncHtml(next);
  console.log(`Version bumped to ${next}`);
} else {
  console.error(`Unknown command: ${command} (expected sync, check, or bump)`);
  process.exit(1);
}
