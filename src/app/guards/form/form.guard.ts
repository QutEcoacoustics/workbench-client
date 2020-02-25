import { Injectable, ViewChild } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { CanDeactivate } from "@angular/router";
import { FormComponent } from "src/app/component/shared/form/form.component";

type Constructor<T> = new (...args: any[]) => T;

interface FormCheck {
  isFormTouched(): boolean;
}

export function WithFormCheck<T extends Constructor<{}>>(
  Base: T = class {} as any
) {
  class Temporary extends Base implements FormCheck {
    @ViewChild(FormComponent) appForm: FormComponent;
    form: FormGroup;

    isFormTouched() {
      console.log("isFormTouched: ", this.appForm.form.touched);
      return this.appForm.form.touched;
    }
  }

  return Temporary;
}

@Injectable()
export class FormTouchedGuard
  implements CanDeactivate<{ form: AbstractControl }> {
  canDeactivate(component) {
    console.log("FormTouchedGuard", component);

    if (!component.isFormTouched) {
      console.log("Non form component");
      return true;
    }

    return component.isFormTouched()
      ? confirm("Are you sure you want to leave?")
      : true;
  }
}
