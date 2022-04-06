import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { DefaultMenu, DEFAULT_MENU } from "@helpers/page/defaultMenus";
import { AllowsOriginalDownloadComponent } from "@menu/allows-original-download/allows-original-download.component";
import { PermissionsShieldComponent } from "@menu/permissions-shield/permissions-shield.component";
import { WidgetDirective } from "@menu/widget.directive";
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
import { IconsModule } from "@shared/icons/icons.module";
import { UserLinkModule } from "@shared/user-link/user-link.module";
import { LoadingModule } from "../loading/loading.module";
import { ActionMenuComponent } from "./action-menu/action-menu.component";
import { MenuButtonComponent } from "./button/button.component";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header/header.component";
import { MenuLinkComponent } from "./link/link.component";
import { MenuToggleComponent } from "./menu-toggle/menu-toggle.component";
import { MenuComponent } from "./menu/menu.component";
import { PrimaryMenuComponent } from "./primary-menu/primary-menu.component";
import { SecondaryMenuComponent } from "./secondary-menu/secondary-menu.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { UserBadgeComponent } from "./user-badge/user-badge.component";

const privateComponents = [
  MenuButtonComponent,
  MenuLinkComponent,
  UserBadgeComponent,
  HeaderDropdownComponent,
  HeaderItemComponent,
];

const publicComponents = [
  MenuComponent,
  PermissionsShieldComponent,
  WidgetDirective,
  SecondaryMenuComponent,
  ActionMenuComponent,
  MenuToggleComponent,
  PrimaryMenuComponent,
  HeaderComponent,
  SideNavComponent,
  AllowsOriginalDownloadComponent,
];

/**
 * Menus Module
 */
@NgModule({
  declarations: [...privateComponents, ...publicComponents],
  imports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    IconsModule,
    LoadingModule,
    PipesModule,
    DirectivesModule,
    UserLinkModule,
  ],
  providers: [
    {
      provide: DEFAULT_MENU,
      useFactory: DefaultMenu.getMenu,
      deps: [ConfigService],
    },
    MenuService,
  ],
  exports: publicComponents,
})
export class MenuModule {}
