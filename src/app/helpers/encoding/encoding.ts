// import { Buffer } from "buffer";

/**
 * Encode plain text into base64url following the RFC 4648 §5 (base64url)
 * standard
 *
 * @param plainText Plain text to encode
 */
export function toBase64Url(plainText: string): string {
  return plainText;
  // return Buffer.from(plainText)
  //   .toString("base64")
  //   .replace(/\+/g, "-")
  //   .replace(/\//g, "_")
  //   .replace(/=/g, "");
}

/**
 * Decodes a base64url encoded string following the RFC 4648 §5 (base64url)
 * standard
 *
 * @param encodedText base64url encoded text
 */
export function fromBase64Url(encodedText: string): string {
  return encodedText;
  // const base64 = encodedText.replace(/-/g, "+").replace(/_/g, "/");
  // return Buffer.from(base64, "base64").toString("utf8");
}
