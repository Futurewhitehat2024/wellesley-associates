import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destRoot = path.join(
  process.env.USERPROFILE || "C:\\Users\\orlan",
  "OneDrive",
  "Documents",
  "Wellesley Collective - Business Files",
  "08-Website-and-Ops",
  "site-source"
);
const currentDir = path.join(destRoot, "current");
const snapshotsDir = path.join(destRoot, "snapshots");
const skip = new Set([".git", "node_modules", ".DS_Store"]);

function shouldSkip(name) {
  return skip.has(name);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (shouldSkip(entry.name)) continue;
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(fromPath, toPath);
    else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(toPath), { recursive: true });
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (shouldSkip(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) n += countFiles(full);
    else n += 1;
  }
  return n;
}

function gitInfo() {
  try {
    const commit = execSync("git rev-parse --short HEAD", { cwd: srcRoot, encoding: "utf8" }).trim();
    const message = execSync("git log -1 --pretty=%s", { cwd: srcRoot, encoding: "utf8" }).trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: srcRoot, encoding: "utf8" }).trim();
    return { commit, message, branch };
  } catch {
    return { commit: "unknown", message: "", branch: "" };
  }
}

if (!fs.existsSync(path.dirname(destRoot))) {
  throw new Error("OneDrive Wellesley Collective folder not found. Expected: " + path.dirname(destRoot));
}

fs.mkdirSync(destRoot, { recursive: true });
fs.mkdirSync(snapshotsDir, { recursive: true });
fs.rmSync(currentDir, { recursive: true, force: true });
copyDir(srcRoot, currentDir);

const when = new Date();
const stamp = when.toISOString().slice(0, 10);
const git = gitInfo();
const files = countFiles(currentDir);
const restore = `# Restore Wellesley Collective website

This folder is the GitHub-independent backup of wellesleycollective.com.

## Where things are

- **Always-current files:** \`current\\\`
- **Always-current zip:** \`wellesley-associates-latest.zip\`
- **Dated snapshots:** \`snapshots\\\`
- **Live working copy on this PC:** \`C:\\\\Users\\\\orlan\\\\wellesley-associates\\\`

## Rebuild the site from this backup

1. Copy \`current\` (or unzip the latest zip) to a folder, e.g. \`C:\\\\Users\\\\orlan\\\\wellesley-associates\\\`
2. Install Node.js if needed.
3. From that folder run:

\`\`\`
node scripts/generate.mjs
\`\`\`

That regenerates every HTML page from \`scripts/generate.mjs\`.

4. Publish again:
   - **GitHub Pages:** create a repo, push the folder, set Pages to \`main\` / root, add custom domain \`wellesleycollective.com\`
   - **Vercel or Cloudflare Pages:** import the folder or Git repo, output the site root

## Hosting as of the backup date

- Site: https://wellesleycollective.com
- Repo (if still available): https://github.com/Futurewhitehat2024/wellesley-associates
- Host: GitHub Pages
- Apex A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- www CNAME: Futurewhitehat2024.github.io
- CNAME file in repo: wellesleycollective.com

## What must stay the same

- Brand: navy \`#122345\`, gold \`#DBAB56\`
- Email: rasheed@wellesleycollective.com
- Phone: 239-350-5227
- Calendly: https://calendly.com/rasheed-wellesleycollective/30min
- Life quote embed key lives in \`scripts/generate.mjs\` (STRIFE_KEY)
- Zoho web-to-lead markup lives in \`partials/zoho-lead-form.html\`
- Intake posts in \`js/intake.js\`
- Do not brand BackNine / Quote & Apply wholesale on the public site
- Do not market residential mortgages

## Source of truth

\`scripts/generate.mjs\` is the generator. After copy changes, run it, then run \`node scripts/backup.mjs\` so this OneDrive copy stays in sync.

Last backup: ${when.toISOString()}
Git: ${git.branch} ${git.commit} — ${git.message}
Files copied: ${files}
`;

fs.writeFileSync(path.join(destRoot, "RESTORE.md"), restore);
fs.writeFileSync(
  path.join(destRoot, "MANIFEST.txt"),
  [
    `backed_up_at=${when.toISOString()}`,
    `source=${srcRoot}`,
    `files=${files}`,
    `git_branch=${git.branch}`,
    `git_commit=${git.commit}`,
    `git_message=${git.message}`,
    `live=https://wellesleycollective.com`,
    `repo=https://github.com/Futurewhitehat2024/wellesley-associates`,
  ].join("\n") + "\n"
);

const latestZip = path.join(destRoot, "wellesley-associates-latest.zip");
const datedZip = path.join(snapshotsDir, `wellesley-associates-${stamp}.zip`);
fs.rmSync(latestZip, { force: true });
execSync(`tar -a -cf "${latestZip}" -C "${currentDir}" .`, { stdio: "inherit" });
fs.copyFileSync(latestZip, datedZip);

console.log("backup written to", destRoot);
console.log("files", files);
console.log("zip", latestZip);
console.log("snapshot", datedZip);
