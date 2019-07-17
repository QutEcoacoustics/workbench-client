import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-password-input',
  template: `
    <div class="form-group">
      <label for="{{ id }}">
        {{ to.label }}
        <span *ngIf="to.required">*</span>
      </label>
      <input
        type="password"
        class="form-control"
        [id]="id"
        [ngClass]="{ 'is-invalid': showError }"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
    </div>
  `
})
export class FormlyPasswordInput extends FieldType {}
