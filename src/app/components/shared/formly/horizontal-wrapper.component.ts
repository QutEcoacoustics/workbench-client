import { Component } from "@angular/core";
import { FieldWrapper, FormlyModule } from "@ngx-formly/core";

/**
 * Horizontal wrapper for formly components so they can be center aligned
 * ! Warning, test manually after changes
 */
@Component({
  selector: "baw-horizontal-wrapper",
  template: `
    <div class="form-group row">
      @if (props.label) {
        <label [attr.for]="id" class="col-sm-2 col-form-label">
          {{ props.label }}
          @if (props.required && !props.hideRequiredMarker) {
            *
          }
        </label>
      }
      <div class="col-sm-7">
        <ng-template #fieldComponent></ng-template>
      </div>

      @if (showError) {
        <div class="col-sm-3 invalid-feedback d-block">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      }
    </div>
  `,
  imports: [FormlyModule],
})
export class HorizontalWrapperComponent extends FieldWrapper {}
