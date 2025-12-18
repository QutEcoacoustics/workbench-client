export function testAsset(name: string): string {
  return `/test-assets/${name}`;
}

export function nodeModule(path: string): string {
  return `/node_modules/${path}`;
}
