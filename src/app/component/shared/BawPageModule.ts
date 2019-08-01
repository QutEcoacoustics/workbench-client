import { NgModule } from "@angular/core";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserModule } from "@angular/platform-browser";



@NgModule({
    declarations: [],
    exports: [
      BrowserModule,
      FontAwesomeModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      FormlyModule,
      FormlyBootstrapModule
    ]
  })
  export class BawPageModule { }
