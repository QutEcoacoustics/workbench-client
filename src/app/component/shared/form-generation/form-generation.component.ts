import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-generation',
  templateUrl: './form-generation.component.html',
  styleUrls: ['./form-generation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGenerationComponent implements OnInit {
  @Input() template: any[];
  @Output() messageEvent = new EventEmitter();
  myFormGroup: FormGroup;

  constructor() {}

  ngOnInit() {
    this.checkRequiredFields('template', this.template);

    const group = {};
    this.template.map(input_template => {
      group[input_template.id] = new FormControl('');
    });
    this.myFormGroup = new FormGroup(group);
  }

  onSubmit() {
    this.messageEvent.emit(this.myFormGroup.value);
  }

  checkRequiredFields(name: string, input: any) {
    if (input === null || input === undefined) {
      throw new Error('Attribute ' + name + ' is required');
    }
  }
}
