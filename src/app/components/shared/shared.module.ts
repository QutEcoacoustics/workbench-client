import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MenuModule } from "@menu/menu.module";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DateValueAccessorModule } from "angular-date-value-accessor";

const sharedModules = [
  BrowserAnimationsModule,
  DateValueAccessorModule,

  FormlyModule,
  FormsModule,
  ReactiveFormsModule,
  FormlyBootstrapModule,

  NgxDatatableModule,

  MenuModule,
];


/**
 * Shared Components Module
 */
@NgModule({
  exports: [...sharedModules],
})
export class SharedModule {}
