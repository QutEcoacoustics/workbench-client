import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private _jsonURL = 'assets/templates/register-form-template.json';
  myFormGroup: FormGroup;
  formTemplate: any[];

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      this.formTemplate = data;
    });
  }

  ngOnInit() {}

  receiveFormOutput($event: any) {
    console.debug($event);
  }

  getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }
}
