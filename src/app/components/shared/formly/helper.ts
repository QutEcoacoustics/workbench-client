import { AbstractControl, FormControl } from "@angular/forms";

export const asFormControl = (formControl: AbstractControl): FormControl =>
  formControl as FormControl;
