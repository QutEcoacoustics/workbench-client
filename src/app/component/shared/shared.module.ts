import { NgModule } from "@angular/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { sharedComponents, sharedModules } from "./shared.components";
import { UserBadgeComponent } from './user-badges/user-badge/user-badge.component';

@NgModule({
  declarations: [...sharedComponents, UserBadgeComponent],
  imports: [sharedModules],
  exports: [sharedModules, sharedComponents]
})
export class SharedModule {
  constructor() {
    library.add(fas);
  }
}
