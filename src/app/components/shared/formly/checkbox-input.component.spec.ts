import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule, FormlyTemplateOptions } from '@ngx-formly/core';
import { formlyRoot } from 'src/app/app.helper';
import { FormlyCheckboxInput } from './checkbox-input.component';

describe('FormlyCheckboxInput', () => {
  let model: object;
  let formGroup: FormGroup;
  let spectator: SpectatorHost<FormlyCheckboxInput>;
  const createHost = createHostFactory({
    component: FormlyCheckboxInput,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyRoot),
      FormlyBootstrapModule,
    ],
  });

  function getCheckbox() {
    return spectator.query<HTMLInputElement>('input[type=\'checkbox\']');
  }

  function setup(
    key: string = 'checkbox',
    options: FormlyTemplateOptions = {}
  ) {
    formGroup = new FormGroup({ checkbox: new FormControl('') });
    model = {};

    spectator = createHost(
      `
      <form [formGroup]="formGroup">
        <formly-checkbox-input></formly-checkbox-input>
      </form>
      `,
      {
        hostProps: { formGroup },
        props: {
          field: {
            model,
            key,
            formControl: formGroup.get('checkbox'),
            templateOptions: options,
          },
        },
      }
    );
    spectator.detectChanges();
  }

  it('should display checkbox', () => {
    setup();
    expect(getCheckbox()).toBeTruthy();
  });

  it('should activate checkbox on click', () => {
    setup();
    const checkbox = getCheckbox();
    checkbox.click();
    expect(checkbox.checked).toBeTruthy();
  });

  it('should deactivate checkbox on click', () => {
    setup();
    const checkbox = getCheckbox();
    checkbox.click();
    checkbox.click();
    expect(checkbox.checked).toBeFalsy();
  });

  // TODO Implement
});
