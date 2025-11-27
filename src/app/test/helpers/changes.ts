/**
 * These helpers can be used to consolidate the change detection cycle of
 * Angular components and external Lit web components for use in tests
 */

import { Spectator } from "@ngneat/spectator";

// The correct solution here would be to import the LitElement type from the
// "lit" package. However this would mean that we'd have to add "lit" as a dev
// dependency for the one type, which seems a bit excessive.
// Since we only need the updateComplete property, I have hacked together a
// polymorphic type that describes what we need out of a LitElement.
//
// If you find yourself needing this type in other places, consider just adding
// "lit" as a dev dependency and importing the type from there.
//
// Downsides to this approach:
// - If the LitElement API changes, this type might become incorrect
type PseudoLitElement = HTMLElement & { updateComplete: Promise<unknown> };

/**
 * Detect changes in Angular components and Lit web components
 *
 * @param spec The spectator instance to detect changes on
 */
export async function detectChanges<T>(spec: Spectator<T>) {
  // Detect changes in Angular components
  spec.detectChanges();

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
    "oe-typeahead",
  ];

  for (const selector of webComponentSelectors) {
    const foundElements = spec.element.querySelectorAll<PseudoLitElement>(selector);

    for (const component of foundElements) {
      await component.updateComplete;
    }
  }

  // We use whenStable here to ensure that all async operations
  // (like Promises or Observables) are completed before proceeding.
  await spec.fixture.whenStable();

  spec.detectChanges();
}
