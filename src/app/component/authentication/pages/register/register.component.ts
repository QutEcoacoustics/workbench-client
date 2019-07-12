import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import register_form_template from 'src/app/templates/register-form-template';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  myFormGroup: FormGroup;
  formTemplate: any = register_form_template;

  constructor() {}

  ngOnInit() {
    const group = {};
    this.formTemplate.map(input_template => {
      group[input_template.id] = new FormControl('');
    });
    this.myFormGroup = new FormGroup(group);
  }

  onSubmit() {
    console.log(this.myFormGroup.value);
  }
}
