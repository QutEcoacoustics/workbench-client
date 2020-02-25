import { Injectable, QueryList, ViewChildren } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { CanDeactivate } from "@angular/router";
import { FormComponent } from "src/app/component/shared/form/form.component";
import { Constructor } from "src/app/helpers/advancedTypes";

/**
 * Add form checking to the component
 * @param Base Class to extend
 */
export function WithFormCheck<T extends Constructor<{}>>(
  Base: T = class {} as any
) {
  class Temporary extends Base {
    @ViewChildren(FormComponent) appForms: QueryList<FormComponent>;

    /**
     * Determine if any forms have been touched
     */
    isFormTouched() {
      return this.appForms.some(appForm => appForm.form.touched);
    }
  }

  return Temporary;
}

/**
 * Form checking guard.
 * This stops the user from leaving a page where a form has been
 * modified by the user in any way.
 */
@Injectable()
export class FormTouchedGuard
  implements CanDeactivate<{ form: AbstractControl }> {
  canDeactivate(component: any) {
    // If component doesn't have a form, ignore it
    if (!component.isFormTouched) {
      return true;
    }

    return component.isFormTouched()
      ? confirm("Are you sure you want to leave?")
      : true;
  }
}
