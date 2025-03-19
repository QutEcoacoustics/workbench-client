/**
 * These helpers can be used to consolidate the change detection cycle of
 * Angular components and external Lit web components for use in tests
 */

import { Spectator } from "@ngneat/spectator";

/**
 * Detect changes in Angular components and Lit web components
 *
 * @param spectator The spectator instance to detect changes on
 */
export async function detectChanges<T>(spectator: Spectator<T>) {
  do {
    // Detect changes in Angular components
    spectator.detectChanges();

    // wait for the lit lifecycle to complete
    //
    // we re-query for web component because some web components might create
    // other web components during their update cycle
    // this means that we have to query for the web components every update
    // cycle to ensure that we wait for all of them to be stable
    const webComponentSelectors = [
      "oe-verification-grid-tile",
      "oe-verification-bootstrap",
      "oe-verification",
      "oe-media-controls",
      "oe-indicator",
      "oe-axes",
      "oe-verification-grid",
      "oe-data-source",
    ];

    const webComponents: any[] = [];
    for (const selector of webComponentSelectors) {
      const foundElements = spectator.element.querySelectorAll(selector);
      webComponents.push(...foundElements);
    }

    for (const component of webComponents) {
      await component.updateComplete;
    }
  } while (
    // keep detecting changes until the angular components are stable
    // we can be sure that the lit components are stable because we perform their
    // update cycle last
    !spectator.fixture.isStable
  );
}
