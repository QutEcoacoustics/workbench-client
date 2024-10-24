import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

export interface UnsavedInputCheckingComponent {
  hasUnsavedChanges: boolean;
}

/**
 * Input checking guard.
 * This stops the user from leaving a page where an input has been
 * modified by the user in any way which has not been saved
 */
@Injectable()
export class UnsavedInputGuard implements CanDeactivate<UnsavedInputCheckingComponent> {
  public canDeactivate(component: UnsavedInputCheckingComponent): boolean {
    // canDeactivate guards can be called with null components: https://github.com/angular/angular/issues/40545
    if (!component) {
      return true;
    }

    return component.hasUnsavedChanges
      ? confirm(
          "Changes to this page will be lost! Are you sure you want to leave?"
        )
      : true;
  }
}
