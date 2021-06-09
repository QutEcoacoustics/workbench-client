import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { NgbModalModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { IconsModule } from "@shared/icons/icons.module";
import { LoadingModule } from "../loading/loading.module";
import { MenuButtonComponent } from "./button/button.component";
import { MenuLinkComponent } from "./link/link.component";
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
    MenuLinkComponent,
    MenuComponent,
    PermissionsShieldComponent,
    UserBadgeComponent,
    WidgetDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    NgbTooltipModule,
    IconsModule,
    AuthenticatedImageModule,
    LoadingModule,
    PipesModule,
    DirectivesModule,
  ],
  exports: [MenuComponent, PermissionsShieldComponent, WidgetDirective],
})
export class MenuModule {}
