export function testAsset(name: string): string {
  return `/assets/test-assets/${name}`;
}

export function nodeModule(path: string): string {
  return `/base/node_modules/${path}`;
}

export async function base64EncodeFlac(path: string) {
  const binary = await fetch(path).then((res) => res.arrayBuffer());
  const bytes = new Uint8Array(binary);

  let base64 = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    base64 += String.fromCharCode(bytes[i]);
  }
  base64 = btoa(base64);

  return `data:audio/flac;base64,${base64}`;
}
