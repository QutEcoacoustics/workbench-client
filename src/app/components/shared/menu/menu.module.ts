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
import { ConfigService } from "@services/config/config.service";
import { MenuService } from "@services/menu/menu.service";
import { IconsModule } from "@shared/icons/icons.module";
import { TimeSinceComponent } from "@shared/datetime-formats/time-since/time-since.component";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
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
import { WebsiteStatusIndicatorComponent } from "./website-status-indicator/website-status-indicator.component";

const privateComponents = [
  MenuButtonComponent,
  MenuLinkComponent,
  UserBadgeComponent,
  HeaderDropdownComponent,
  HeaderItemComponent,
  WebsiteStatusIndicatorComponent,
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
  imports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    IconsModule,
    DirectivesModule,
    UserLinkComponent,
    TimeSinceComponent,
    ...privateComponents,
    ...publicComponents,
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
