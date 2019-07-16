import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private _jsonURL = 'assets/templates/register-form-template.json';
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
