import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { fontAwesomeLibraries } from "src/app/app.helper";
import { PermissionsShieldComponent } from "../permissions-shield/permissions-shield.component";
import { UserBadgeComponent } from "../user-badges/user-badge/user-badge.component";
import { UserBadgesComponent } from "../user-badges/user-badges.component";
import { WidgetDirective } from "../widget/widget.directive";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";

@NgModule({
  declarations: [
    MenuButtonComponent,
    MenuExternalLinkComponent,
    MenuInternalLinkComponent,
    MenuComponent,
    PermissionsShieldComponent,
    UserBadgesComponent,
    UserBadgeComponent,
    WidgetDirective
  ],
  imports: [CommonModule, RouterModule, NgbModule, FontAwesomeModule],
  exports: [
    MenuComponent,
    PermissionsShieldComponent,
    UserBadgesComponent,
    WidgetDirective
  ]
})
export class MenuModule {
  constructor() {
    fontAwesomeLibraries(library);
  }
}
