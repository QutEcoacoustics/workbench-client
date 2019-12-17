import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";

@NgModule({
  declarations: [
    MenuButtonComponent,
    MenuExternalLinkComponent,
    MenuInternalLinkComponent,
    MenuComponent
  ],
  imports: [CommonModule, RouterModule, NgbModule, FontAwesomeModule],
  exports: [MenuComponent]
})
export class MenuModule {
  constructor() {
    library.add(fas);
  }
}
