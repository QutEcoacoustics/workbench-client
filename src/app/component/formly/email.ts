import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-email-input',
  template: `
    <div class="form-group">
      <label for="{{ id }}">
        {{ to.label }}
        <span *ngIf="to.required">*</span>
      </label>
      <input
        type="email"
        class="form-control"
        [id]="id"
        [ngClass]="{ 'is-invalid': showError }"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
    </div>
  `
})
export class FormlyEmailInput extends FieldType {}
