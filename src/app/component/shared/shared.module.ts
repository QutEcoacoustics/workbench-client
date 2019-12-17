import { NgModule } from "@angular/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { sharedComponents, sharedModules } from "./shared.components";

@NgModule({
  declarations: [...sharedComponents],
  imports: [sharedModules],
  exports: [sharedModules, sharedComponents]
})
export class SharedModule {
  constructor() {
    library.add(fas);
  }
}
