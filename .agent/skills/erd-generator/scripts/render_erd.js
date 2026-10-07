import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const input = process.argv[2] || "docs/architecture/schema.mmd";
const output = "docs/architecture/erd.svg";

if (!fs.existsSync(input)) {
    console.log("SYNTAX_ERROR: input file not found.");
    process.exit(1);
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.rmSync(output, { force: true });

const result = spawnSync(
    "npx",
    ["mmdc", "-i", input, "-o", output],
    { encoding: "utf-8", shell: process.platform === "win32" }
);

if (result.status === 0 && fs.existsSync(output)) {
    console.log("SUCCESS");
    process.exit(0);
}

const trace = [result.stderr, result.error && result.error.message]
    .filter(Boolean)
    .join("\n")
    .trim();

console.log(`SYNTAX_ERROR: ${trace || "mmdc failed with no error output"}`);
process.exit(1);