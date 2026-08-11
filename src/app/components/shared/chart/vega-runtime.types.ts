export interface VegaRuntime {
  embed: typeof import("vega-embed").default;
  vega: typeof import("vega");
}
