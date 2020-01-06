import { NgModule } from "@angular/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fontAwesomeLibraries } from "src/app/app.helper";
import {
  formlyAccessors,
  sharedComponents,
  sharedModules
} from "./shared.components";

@NgModule({
  declarations: [...sharedComponents, ...formlyAccessors],
  imports: [sharedModules],
  exports: [sharedModules, sharedComponents]
})
export class SharedModule {
  constructor() {
    fontAwesomeLibraries(library);
  }
}
