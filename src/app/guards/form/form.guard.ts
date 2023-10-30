import {
  Directive,
  Injectable,
  QueryList,
  Type,
  ViewChildren,
} from "@angular/core";

import { FormComponent } from "@shared/form/form.component";

/**
 * Interface for FormCheckingPageComponent.
 */
export interface FormCheckingComponent {
  appForms: QueryList<FormComponent>;
  isFormTouched(): boolean;
  resetForms(): void;
}

/**
 * Add form checking to the component
 *
 * @param base Class to extend
 */
export function withFormCheck<T extends Type<any>>(base: T = class {} as any) {
  @Directive()
  class FormCheckingPageDirective
    extends base
    implements FormCheckingComponent
  {
    @ViewChildren(FormComponent) public appForms: QueryList<FormComponent>;

    /**
     * Determine if any forms have been touched
     */
    public isFormTouched(): boolean {
      return this.appForms?.some((appForm) => appForm.form.dirty) ?? false;
    }

    /**
     * Reset all forms on the page, this should be used before navigation
     */
    public resetForms() {
      this.appForms?.map((appForm) => appForm.form.markAsPristine());
    }
  }

  return FormCheckingPageDirective;
}

/**
 * Form checking guard.
 * This stops the user from leaving a page where a form has been
 * modified by the user in any way.
 */
@Injectable()
export class FormTouchedGuard  {
  @ViewChildren(FormComponent) public appForms: QueryList<FormComponent>;

  public canDeactivate(component: FormCheckingComponent): boolean {
    // canDeactivate guards can be called with null components: https://github.com/angular/angular/issues/40545
    if (!component) {
      return true;
    }

    // If component doesn't have a form, ignore it
    if (typeof component.isFormTouched !== "function") {
      return true;
    }

    return component.isFormTouched()
      ? confirm("Form data will be lost! Are you sure you want to leave?")
      : true;
  }
}
