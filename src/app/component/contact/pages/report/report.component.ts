import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ContactReportComponent implements OnInit {
  private _jsonURL = 'assets/templates/report-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      this.model = data.model;
      this.fields = data.fields;
    });
  }

  getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  clearError() {
    this.error = null;
  }

  submit(model: any) {
    if (this.form.status === 'INVALID') {
      return;
    }

    console.log(model);
  }
}
