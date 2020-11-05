import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { fontAwesomeLibraries } from "src/app/app.helper";
import { LoadingModule } from "../loading/loading.module";
import { MenuButtonComponent } from "./button/button.component";
import { MenuExternalLinkComponent } from "./external-link/external-link.component";
import { MenuInternalLinkComponent } from "./internal-link/internal-link.component";
import { MenuComponent } from "./menu.component";
import { PermissionsShieldComponent } from "./permissions-shield/permissions-shield.component";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { WidgetDirective } from "./widget/widget.directive";

/**
 * Menus Module
 */
@NgModule({
  declarations: [
    MenuButtonComponent,
    MenuExternalLinkComponent,
    MenuInternalLinkComponent,
    MenuComponent,
    PermissionsShieldComponent,
    UserBadgeComponent,
    WidgetDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule,
    AuthenticatedImageModule,
    LoadingModule,
    PipesModule,
  ],
  exports: [MenuComponent, PermissionsShieldComponent, WidgetDirective],
})
export class MenuModule {
  constructor(library: FaIconLibrary) {
    fontAwesomeLibraries(library);
  }
}
