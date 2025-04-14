import { Component, OnInit } from "@angular/core";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { asFormControl } from "./helper";

/**
 * Location Input
 */
@Component({
  selector: "baw-password-confirmation-input",
  template: `
    <div class="form-group mb-3">
      <label for="password">Password {{ props.required ? " *" : "" }}</label>
      <input
        id="password"
        type="password"
        class="form-control"
        auto-complete="new-password"
        [class]="{ 'is-invalid': passwordError }"
        [formlyAttributes]="field"
        [(ngModel)]="password"
        (ngModelChange)="updateModel()"
      />

      @if (passwordError) {
        <div
          class="invalid-feedback"
          style="display: block;"
        >
          {{ getError() }}
        </div>
      }
    </div>

    <div class="form-group mb-3">
      <label for="confirmation">
        Password Confirmation {{ props.required ? " *" : "" }}
      </label>
      <input
        id="confirmation"
        type="password"
        class="form-control"
        auto-complete="new-password"
        [class]="{ 'is-invalid': confirmationError }"
        [formlyAttributes]="field"
        [(ngModel)]="confirmation"
        (ngModelChange)="updateModel()"
      />

      @if (confirmationError) {
        <div class="invalid-feedback" style="display: block;">
          {{ getError() }}
        </div>
      }
    </div>

    <input
      type="hidden"
      [id]="field.id"
      [formControl]="asFormControl(formControl)"
    />
  `,
  imports: [FormsModule, FormlyModule, ReactiveFormsModule]
})
export class PasswordConfirmationInputComponent
  extends FieldType
  implements OnInit
{
  public asFormControl = asFormControl;
  public password = "";
  public passwordError: boolean;
  public confirmation = "";
  public confirmationError: boolean;

  public ngOnInit() {
    this.formControl.setValidators(() => {
      const error = this.validatePassword();
      return error ? { [this.field.key.toString()]: error } : null;
    });
    this.formControl.updateValueAndValidity();
  }

  /**
   * Update hidden input
   */
  public updateModel() {
    this.formControl.setValue({
      password: this.password,
      passwordConfirmation: this.confirmation,
    });
    this.model["password"] = this.password;
    this.model["passwordConfirmation"] = this.confirmation;
  }

  public getError(): string {
    return this.formControl.getError(this.field.key.toString());
  }

  /**
   * Validate location values and return error if any
   */
  private validatePassword(): string {
    this.passwordError = false;
    this.confirmationError = false;

    if (!this.formControl.dirty && this.password.length === 0) {
      return;
    }

    if (this.password.length < 6) {
      this.passwordError = true;
      return "Password must be longer than 6 characters";
    } else if (this.password !== this.confirmation) {
      this.confirmationError = true;
      return "Passwords do not match";
    }
  }
}
