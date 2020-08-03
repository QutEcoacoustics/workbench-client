import { Component, OnInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

/**
 * Location Input
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: "formly-password-confirmation-input",
  template: `
    <div class="form-group">
      <label for="password">Password {{ to.required ? " *" : "" }}</label>
      <input
        id="password"
        type="password"
        class="form-control"
        [class]="{ 'is-invalid': passwordError }"
        [formlyAttributes]="field"
        [(ngModel)]="password"
        (ngModelChange)="updateModel()"
      />

      <div
        *ngIf="passwordError"
        class="invalid-feedback"
        style="display: block;"
      >
        {{ getError() }}
      </div>
    </div>

    <div class="form-group">
      <label for="confirmation">
        Password Confirmation {{ to.required ? " *" : "" }}
      </label>
      <input
        id="confirmation"
        type="password"
        class="form-control"
        [class]="{ 'is-invalid': confirmationError }"
        [formlyAttributes]="field"
        [(ngModel)]="confirmation"
        (ngModelChange)="updateModel()"
      />

      <div
        *ngIf="confirmationError"
        class="invalid-feedback"
        style="display: block;"
      >
        {{ getError() }}
      </div>
    </div>

    <input type="hidden" [id]="field.id" [formControl]="formControl" />
  `,
})
// tslint:disable-next-line: component-class-suffix
export class FormlyPasswordConfirmationInput extends FieldType
  implements OnInit {
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
    });
    this.model["password"] = this.password;
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
