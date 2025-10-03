import { buildFullGeneration } from "./src/logic/gen.js";

// Temporarily change to web-preact directory to test generation
process.chdir("../../web-preact");

console.log("Testing generation in:", process.cwd());
console.log("Expected to find views in: src/views/");

await buildFullGeneration("preact");

console.log("\nGeneration complete! Check web-preact/src/views.gen.ts");
