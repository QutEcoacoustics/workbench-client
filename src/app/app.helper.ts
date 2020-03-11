import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ConfigOption } from "@ngx-formly/core";
import { FormlyImageInput } from "./component/shared/formly/image-input.component";
import { FormlyQuestionAnswerAction } from "./component/shared/formly/question-answer-action.component";
import { FormlyQuestionAnswer } from "./component/shared/formly/question-answer.component";
import { FormlyTimezoneInput } from "./component/shared/formly/timezone-input.component";
import { FormTouchedGuard } from "./guards/form/form.guard";
import {
  API_CONFIG,
  API_ROOT,
  AppInitializer,
  CMS_ROOT
} from "./helpers/app-initializer/app-initializer";
import { AppConfigService } from "./services/app-config/app-config.service";
import {
  accountResolvers,
  AccountService
} from "./services/baw-api/account.service";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor.service";
import {
  projectResolvers,
  ProjectsService
} from "./services/baw-api/projects.service";
import {
  scriptResolvers,
  ScriptsService
} from "./services/baw-api/scripts.service";
import { SecurityService } from "./services/baw-api/security.service";
import {
  shallowSiteResolvers,
  ShallowSitesService,
  siteResolvers,
  SitesService
} from "./services/baw-api/sites.service";
import { userResolvers, UserService } from "./services/baw-api/user.service";

export function minLengthValidationMessage(err, field) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

export function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

export const toastrRoot = {
  positionClass: "toast-top-center"
};

export const formlyRoot = {
  types: [
    {
      name: "image",
      component: FormlyImageInput
    },
    {
      name: "timezone",
      component: FormlyTimezoneInput
    },
    {
      name: "question-answer",
      component: FormlyQuestionAnswer
    },
    {
      name: "question-answer-action",
      component: FormlyQuestionAnswerAction
    }
  ],
  validationMessages: [
    { name: "required", message: "This field is required" },
    { name: "minlength", message: minLengthValidationMessage },
    { name: "maxlength", message: maxLengthValidationMessage },
    { name: "min", message: minValidationMessage },
    { name: "max", message: maxValidationMessage }
  ]
} as ConfigOption;

export function fontAwesomeLibraries(library: FaIconLibrary) {
  library.addIconPacks(fas);
}

export const providers = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  {
    provide: APP_INITIALIZER,
    useFactory: AppInitializer.initializerFactory,
    multi: true,
    deps: [API_CONFIG]
  },
  {
    provide: API_ROOT,
    useFactory: AppInitializer.apiRootFactory
  },
  {
    provide: CMS_ROOT,
    useFactory: AppInitializer.cmsRootFactory
  },
  FormTouchedGuard,
  AppConfigService,
  AccountService,
  ProjectsService,
  ScriptsService,
  SecurityService,
  ShallowSitesService,
  SitesService,
  UserService,
  ...accountResolvers,
  ...projectResolvers,
  ...scriptResolvers,
  ...siteResolvers,
  ...shallowSiteResolvers,
  ...userResolvers
];
