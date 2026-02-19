/**
 * @description
 * Imports and injects the global styles for the workbench client's web
 * components.
 *
 * This is automatically called during the web component registration process
 * so that the styles are applied before any components are instantiated and
 * so that using these web components only requires a single import (instead of
 * also needing to import styles separately).
 */
export async function injectStyles(): Promise<void> {
  const stylesUrl = new URL("styles.css", import.meta.url);

  const styleFile = await fetch(stylesUrl.href);
  const styleContent = await styleFile.text();

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styleContent);

  document.adoptedStyleSheets?.push(styleSheet);
}
