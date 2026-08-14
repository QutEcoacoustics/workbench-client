import type { VegaRuntime } from "./vega-runtime.types";

export async function loadBrowserVega(): Promise<VegaRuntime> {
  // Intentionally throws: SSR must never load Vega runtime.
  // If this throws at runtime, the platform guard in ChartComponent was bypassed.
  // Keep this explicit failure so regressions are discovered early.
  // See README.
  throw new Error("Vega runtime is browser-only and cannot be loaded in SSR.");
}
