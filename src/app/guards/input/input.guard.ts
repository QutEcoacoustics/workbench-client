import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import {
  SignalOr,
  unwrapPotentialSignal,
} from "@helpers/signals/signals";

export interface UnsavedInputCheckingComponent {
  hasUnsavedChanges: SignalOr<boolean>;
}

/**
 * Input checking guard.
 * This stops the user from leaving a page where an input has been
 * modified by the user in any way which has not been saved
 */
@Injectable({ providedIn: "root" })
export class UnsavedInputGuard
  implements CanDeactivate<UnsavedInputCheckingComponent>
{
  public canDeactivate(component: UnsavedInputCheckingComponent): boolean {
    // canDeactivate guards can be called with null components: https://github.com/angular/angular/issues/40545
    if (!component) {
      return true;
    }

    const hasUnsavedChanges = unwrapPotentialSignal(
      component.hasUnsavedChanges,
    );

    return hasUnsavedChanges
      ? confirm(
          "Changes to this page will be lost! Are you sure you want to leave?",
        )
      : true;
  }
}
