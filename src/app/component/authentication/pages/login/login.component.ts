import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _jsonURL = 'assets/templates/login-form-template.json';
  formTemplate: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getJSON().subscribe(data => {
      this.formTemplate = data;
    });
  }

  getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  onSubmit(submission: any) {
    console.log(submission); // This will print out the full submission from Form.io API.
  }
}
