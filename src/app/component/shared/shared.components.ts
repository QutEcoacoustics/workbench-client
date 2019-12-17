import { ActionMenuComponent } from "./action-menu/action-menu.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { PermissionsShieldComponent } from "./permissions-shield/permissions-shield.component";
import { SecondaryMenuComponent } from "./secondary-menu/secondary-menu.component";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { ForbiddenComponent } from "./utilities/forbidden.component";
import { ItemNotFoundComponent } from "./utilities/item-not-found.component";
import { UnauthorizedComponent } from "./utilities/unauthorized.component";
import { WIPComponent } from "./wip/wip.component";

export const sharedComponents = [
  FooterComponent,
  ActionMenuComponent,
  SecondaryMenuComponent,
  FormComponent,
  UserBadgeComponent,
  PermissionsShieldComponent,
  ItemNotFoundComponent,
  UnauthorizedComponent,
  ForbiddenComponent,
  WIPComponent
];
