import { ActionMenuComponent } from "./action-menu/action-menu.component";
import { CmsComponent } from "./cms/cms.component";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { FileValueAccessor } from "./formly/file-input.directive";
import { FormlyImageInput } from "./formly/image-input.component";
import { FormlyQuestionAnswerAction } from "./formly/question-answer-action.component";
import { FormlyQuestionAnswer } from "./formly/question-answer.component";
import { FormlyTimezoneInput } from "./formly/timezone-input.component";
import { MenuButtonComponent } from "./menu/button/button.component";
import { MenuExternalLinkComponent } from "./menu/external-link/external-link.component";
import { MenuInternalLinkComponent } from "./menu/internal-link/internal-link.component";
import { MenuComponent } from "./menu/menu.component";
import { PermissionsShieldComponent } from "./permissions-shield/permissions-shield.component";
import { SecondaryMenuComponent } from "./secondary-menu/secondary-menu.component";
import { TimezoneFormPipe } from "./timezone/timezone.pipe";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { WIPComponent } from "./wip/wip.component";

export const sharedComponents = [
  FooterComponent,
  MenuComponent,
  MenuButtonComponent,
  MenuInternalLinkComponent,
  MenuExternalLinkComponent,
  ActionMenuComponent,
  SecondaryMenuComponent,
  FormComponent,
  UserBadgeComponent,
  PermissionsShieldComponent,
  ErrorHandlerComponent,
  WIPComponent,
  CmsComponent,
  FormlyImageInput,
  FormlyTimezoneInput,
  FormlyQuestionAnswer,
  FormlyQuestionAnswerAction,
  TimezoneFormPipe
];

export const formlyAccessors = [FileValueAccessor];
