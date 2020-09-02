import { NgModule } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { LineTruncationDirective } from "ngx-line-truncation";
import { fontAwesomeLibraries } from "src/app/app.helper";
import {
  internalComponents,
  internalModules,
  sharedComponents,
  sharedModules,
} from "./shared.components";

/**
 * Shared Components Module
 */
@NgModule({
  declarations: internalComponents,
  imports: internalModules,
  exports: [...sharedModules, ...sharedComponents, LineTruncationDirective],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    fontAwesomeLibraries(library);
  }
}
