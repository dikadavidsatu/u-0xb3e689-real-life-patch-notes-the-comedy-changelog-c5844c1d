import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "v3.1.4: Fixed a bug where walking into a room instantly deleted the reason you went in there, usually while holding the thing you needed.";

function validate(text: string): void {
  if (typeof text !== "string") throw new Error("entry must be a string");
  const chars = [...text];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) throw new Error("entry must not be only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (!/^v\d+\.\d+\.\d+:/.test(text)) {
    throw new Error("entry must start with a version number like v3.1.4:");
  }
  if (!/fixed/i.test(text)) throw new Error("entry must state a fix");
  if (text !== text.trim()) throw new Error("entry must not have leading or trailing whitespace");
  if (text.includes("  ")) throw new Error("entry must not contain double spaces");
  // The gate counts characters, so confirm the text round-trips as clean UTF-8.
  const encoded = new TextEncoder().encode(text);
  if (new TextDecoder("utf-8", { fatal: true }).decode(encoded) !== text) {
    throw new Error("entry must be valid UTF-8");
  }
}

validate(ENTRY);

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "entry.txt"), ENTRY, "utf8");
