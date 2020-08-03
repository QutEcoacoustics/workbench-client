import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import { fontAwesomeLibraries } from "src/app/app.helper";
import { IndicatorComponent } from "./indicator.component";

@NgModule({
  declarations: [IndicatorComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [IndicatorComponent],
})
export class IndicatorModule {
  constructor(library: FaIconLibrary) {
    fontAwesomeLibraries(library);
  }
}
