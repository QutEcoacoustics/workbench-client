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
import { SecondaryMenuComponent } from "./secondary-menu/secondary-menu.component";
import { TimezoneFormPipe } from "./timezone/timezone.pipe";
import { WIPComponent } from "./wip/wip.component";

export const sharedComponents = [
  FooterComponent,
  ActionMenuComponent,
  SecondaryMenuComponent,
  FormComponent,
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
