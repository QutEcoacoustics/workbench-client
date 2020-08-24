/**
 * Strip html tags from a string
 * @param html HTML string to strip
 */
export function stripHtml(html: string): string {
  // ! Check document exists (SSR does not have access to document)
  if (document) {
    const divElement = document.createElement("div");
    divElement.innerHTML = html ?? "";
    return divElement.textContent || divElement.innerText || "";
  } else {
    return undefined;
  }
}
