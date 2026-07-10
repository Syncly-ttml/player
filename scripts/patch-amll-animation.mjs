import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cjsEntry = require.resolve("@applemusic-like-lyrics/core");
const distDir = dirname(cjsEntry);
const files = ["amll-core.mjs", "amll-core.cjs"];
const originalPattern = /wordDe\s*-\s*400/g;
const patchedPattern = /wordDe\s*-\s*0(?:\.0)?/g;

let replacements = 0;

for (const filename of files) {
  const path = join(distDir, filename);
  const source = await readFile(path, "utf8");
  const matches = source.match(originalPattern)?.length ?? 0;

  if (matches > 0) {
    const patched = source.replace(originalPattern, "wordDe - 0");
    await writeFile(path, patched, "utf8");
    replacements += matches;
    console.log(`[AMLL patch] ${filename}: replaced ${matches} occurrence(s).`);
    continue;
  }

  const alreadyPatched = source.match(patchedPattern)?.length ?? 0;
  if (alreadyPatched > 0) {
    console.log(`[AMLL patch] ${filename}: already patched.`);
    continue;
  }

  throw new Error(
    `[AMLL patch] Could not find the expected wordDe - 400 expression in ${filename}.`,
  );
}

console.log(`[AMLL patch] Done. New replacements: ${replacements}.`);
