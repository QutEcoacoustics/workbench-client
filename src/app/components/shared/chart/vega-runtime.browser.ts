import type { Result } from "vega-embed";
import type { VegaRuntime } from "./vega-runtime.types";

// This loader is intentionally browser-only.
// It is selected via package.json conditional imports (`#baw/vega-runtime`).
// Do not import this file directly from other modules; always import the alias.
// See README.
let runtimePromise: Promise<VegaRuntime> | undefined;

export async function loadBrowserVega(): Promise<VegaRuntime> {
  // Cache the dynamic import so multiple charts share one module load.
  runtimePromise ??= import("vega-embed").then(({ default: embed, vega }) => ({
    embed,
    vega,
  }));

  return runtimePromise;
}

export type VegaResult = Result;
