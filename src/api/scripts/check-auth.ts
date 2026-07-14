// Verify Higgsfield API credentials WITHOUT generating anything (no credits spent).
// Run:  node --env-file=.env src/scripts/check-auth.ts   (or: pnpm check:auth)
// Only HTTP status is printed — credentials are never logged.

const keyId = process.env.HF_API_KEY?.trim();
const secret = process.env.HF_API_SECRET?.trim();
const combined = process.env.HF_KEY?.trim();

if (!combined && (!keyId || !secret)) {
  console.error("✗ Missing credentials. Set HF_API_KEY + HF_API_SECRET (or HF_KEY) in .env, then:");
  console.error("    node --env-file=.env src/scripts/check-auth.ts");
  process.exit(1);
}

const cred = combined ?? `${keyId}:${secret}`;
const BASE = "https://platform.higgsfield.ai";

interface Scheme {
  name: string;
  headers: Record<string, string>;
}
const schemes: Scheme[] = [
  { name: "Key", headers: { Authorization: `Key ${cred}` } },
  { name: "Bearer", headers: { Authorization: `Bearer ${cred}` } },
];
if (keyId && secret) {
  schemes.push({ name: "hf-headers", headers: { "hf-api-key": keyId, "hf-secret": secret } });
}
const endpoints = ["/v1/motions", "/v1/soul-styles"];

const summarize = (text: string): string => {
  try {
    const data: unknown = JSON.parse(text);
    if (Array.isArray(data)) return `JSON array, ${data.length} items`;
    if (data && typeof data === "object")
      return `JSON object {${Object.keys(data).slice(0, 6).join(", ")}}`;
    return `JSON: ${String(data).slice(0, 80)}`;
  } catch {
    return text.slice(0, 120).replace(/\s+/g, " ");
  }
};

let ok = false;
let sawAuthReject = false;
let sawNotFound = false;

console.log(`Checking ${BASE} (read-only)…\n`);
outer: for (const ep of endpoints) {
  for (const s of schemes) {
    let status = 0;
    let body = "";
    try {
      const res = await fetch(BASE + ep, {
        method: "GET",
        headers: { Accept: "application/json", ...s.headers },
      });
      status = res.status;
      body = await res.text();
    } catch (err) {
      console.log(`  · ${ep} [auth: ${s.name}] -> network error: ${(err as Error).message}`);
      continue;
    }
    const good = status >= 200 && status < 300;
    console.log(
      `  ${good ? "✓" : "·"} ${ep} [auth: ${s.name}] -> HTTP ${status}${good ? "  " + summarize(body) : ""}`,
    );
    if (good) {
      ok = true;
      break outer;
    }
    if (status === 401 || status === 403) sawAuthReject = true;
    if (status === 404) sawNotFound = true;
  }
}

console.log("");
if (ok) {
  console.log("✓ Credentials accepted — Higgsfield API auth works. (No generation triggered.)");
} else if (sawAuthReject) {
  console.log("✗ Auth rejected (401/403). Check the key id/secret at https://cloud.higgsfield.ai/api-keys.");
  process.exit(2);
} else if (sawNotFound) {
  console.log("? Auth not rejected, but endpoints 404'd — base URL/paths may have changed; auth inconclusive.");
  process.exit(3);
} else {
  console.log("✗ Could not verify (see statuses above).");
  process.exit(2);
}
