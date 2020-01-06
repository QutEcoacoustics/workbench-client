import { NgModule } from "@angular/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
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
    library.add(fas);
  }
}
