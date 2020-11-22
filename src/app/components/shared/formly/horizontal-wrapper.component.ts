import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

/**
 * Horizontal wrapper for formly components so they can be center aligned
 * ! Warning, test manually after changes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formly-horizontal-wrapper',
  template: `
    <div class="form-group row">
      <label [attr.for]="id" class="col-sm-2 col-form-label" *ngIf="to.label">
        {{ to.label }}
        <ng-container *ngIf="to.required && !to.hideRequiredMarker">
          *
        </ng-container>
      </label>
      <div class="col-sm-7">
        <ng-template #fieldComponent></ng-template>
      </div>

      <div *ngIf="showError" class="col-sm-3 invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FormlyHorizontalWrapper extends FieldWrapper {}
