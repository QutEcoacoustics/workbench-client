export function testAsset(name: string): string {
  return `/assets/test-assets/${name}`;
}

export function nodeModule(path: string): string {
  return `/base/node_modules/${path}`;
}
