import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import login_form_template from 'src/app/templates/login-form-template';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  myFormGroup: FormGroup;
  formTemplate: any = login_form_template;

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
