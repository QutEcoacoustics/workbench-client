import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BawApiService } from 'src/app/services/baw-api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-contact-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ContactComponent implements OnInit {
  private _jsonURL = 'assets/templates/contact-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

  constructor(
    private http: HttpClient,
    private api: BawApiService,
    private router: Router
  ) {}

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
