import { Injectable, QueryList, Type, ViewChildren } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { FormComponent } from "src/app/component/shared/form/form.component";

/**
 * Interface for FormCheckingPageComponent.
 */
export interface FormCheckingComponent {
  appForms: QueryList<FormComponent>;
  isFormTouched(): boolean;
}

/**
 * Add form checking to the component
 * @param Base Class to extend
 */
export function WithFormCheck<T extends Type<{}>>(Base: T = class {} as any) {
  class FormCheckingPageComponent extends Base
    implements FormCheckingComponent {
    @ViewChildren(FormComponent) appForms: QueryList<FormComponent>;

    /**
     * Determine if any forms have been touched
     */
    isFormTouched() {
      return this.appForms.some(appForm => appForm.form.dirty);
    }

    /**
     * Reset all forms on the page, this should be used before navigation
     */
    resetForms() {
      return this.appForms.map(appForm => appForm.form.markAsPristine());
    }
  }

  return FormCheckingPageComponent;
}

/**
 * Form checking guard.
 * This stops the user from leaving a page where a form has been
 * modified by the user in any way.
 */
@Injectable()
export class FormTouchedGuard implements CanDeactivate<FormCheckingComponent> {
  canDeactivate(component: FormCheckingComponent) {
    // If component doesn't have a form, ignore it
    if (typeof component.isFormTouched !== "function") {
      return true;
    }

    return component.isFormTouched()
      ? confirm("Form data will be lost! Are you sure you want to leave?")
      : true;
  }
}
