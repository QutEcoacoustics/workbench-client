import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { SignalOr, unwrapPotentialSignal } from "@helpers/signals/signals";

/**
 * Allows interaction with the confirmation.guard to confirm navigation away
 * from the current page if the confirmNavigation property is set to true.
 */
export interface WithNavigationConfirmation {
  /**
   * Whether to confirm navigation away from the current page.
   *
   * This defaults false, but can be set to true to show a confirmation.
   * E.g. If the user has not performed an action that would require unload
   * confirmation.
   *
   * @default false
   */
  confirmNavigation?: SignalOr<boolean>;

  /**
   * A custom message to show in the confirmation dialog.
   * If not provided, a default message will be used.
   *
   * @default "Are you sure you want to leave this page?"
   */
  confirmNavigationMessage?: SignalOr<string>;

  /**
   * Whether to hard block navigation without confirmation.
   *
   * If set to `true`, navigation will be blocked, and just show an alert
   * instead of a confirmation dialog.
   * This should only be used in extreme cases where navigation must not be
   * allowed or we need to wait for something to complete on the main thread.
   * Note that blocking user navigation is generally considered a bad user
   * experience and browser restrictions sometime cause the browser to ignore
   * repeated attempts to block navigation using an alert dialog.
   *
   * @default false
   */
  blockNavigation?: SignalOr<boolean>;
}

/**
 * If the components confirmNavigation property is set to true, the user will be
 * prompted to confirm navigation before leaving the current page.
 *
 * This route guard should be used with a page component that implements the
 * {@link WithNavigationConfirmation} interface.
 *
 * This guard differs from the {@link UnsavedInputGuard} both semantically and
 * in its intended use cases.
 * The UnsavedInputGuard is intended to be used specifically for inputs that
 * will lose their value after navigation.
 * This distinction is made so that the UnsavedInputGuard can be easily changed
 * in the future without having to consider how it will affect other non-input
 * related navigation confirmations.
 * Additionally, because this guard is more generic, it accepts a
 * `confirmNavigation` property to customize the confirmation message.
 */
@Injectable({ providedIn: "root" })
export class NavigationConfirmationGuard
  implements CanDeactivate<WithNavigationConfirmation>
{
  public canDeactivate(component: WithNavigationConfirmation): boolean {
    // canDeactivate guards can be called with null components: https://github.com/angular/angular/issues/40545
    if (!component) {
      return true;
    }

    const confirmNavigation =
      unwrapPotentialSignal(component.confirmNavigation) ?? false;

    const confirmationMessage: string =
      unwrapPotentialSignal(component.confirmNavigationMessage) ??
      "Are you sure you want to leave this page?";

    const hardBlock = unwrapPotentialSignal(component.blockNavigation);
    if (hardBlock) {
      alert(confirmationMessage);
      return false;
    }

    return confirmNavigation ? confirm(confirmationMessage) : true;
  }
}
