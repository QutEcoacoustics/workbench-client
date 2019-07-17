import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-email-input',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyEmailInput extends FieldType implements OnInit {
  constructor() {
    super();
  }

  invalid: boolean;

  ngOnInit() {
    this.invalid = false;
  }

  checkError(event: any) {
    this.invalid = !event.srcElement.validity.valid;
  }
}
