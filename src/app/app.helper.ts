import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { Library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ConfigOption } from "@ngx-formly/core";
import { environment } from "src/environments/environment";
import { FormlyImageInput } from "./component/shared/formly/image-input.component";
import { FormlyQuestionAnswerAction } from "./component/shared/formly/question-answer-action.component";
import { FormlyQuestionAnswer } from "./component/shared/formly/question-answer.component";
import { FormlyTimezoneInput } from "./component/shared/formly/timezone-input.component";
import {
  APP_CONFIG,
  AppConfigService,
  appInitializerFn
} from "./services/app-config/app-config.service";
import {
  APP_CONFIG as MOCK_APP_CONFIG,
  MockAppConfigService
} from "./services/app-config/appConfigMockService";
import { AccountService } from "./services/baw-api/account.service";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor.service";
import {
  BawApiService,
  STUB_CLASS_BUILDER
} from "./services/baw-api/baw-api.service";
import {
  MockBawApiService,
  MockModel
} from "./services/baw-api/mock/baseApiMock.service";
import { MockReadonlyApiService } from "./services/baw-api/mock/readonlyApiMock.service";
import { MockSecurityService } from "./services/baw-api/mock/securityMock.service";
import { MockShowApiService } from "./services/baw-api/mock/showApiMock.service";
import { MockStandardApiService } from "./services/baw-api/mock/standardApiMock.service";
import { ProjectsService } from "./services/baw-api/projects.service";
import { SecurityService } from "./services/baw-api/security.service";
import {
  ShallowSitesService,
  SitesService
} from "./services/baw-api/sites.service";
import { UserService } from "./services/baw-api/user.service";

function minLengthValidationMessage(err, field) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

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

export function fontAwesomeLibraries(library: Library) {
  library.add(fas);
}

export const providers = [
  AppConfigService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  {
    provide: APP_CONFIG,
    useValue: environment.appConfig
  },
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
    multi: true,
    deps: [AppConfigService]
  }
];

export const testAppInitializer = [
  {
    provide: AppConfigService,
    useClass: MockAppConfigService
  },
  {
    provide: MOCK_APP_CONFIG,
    useValue: `http://${window.location.host}/assets/tests/remoteEnvironment.json`
  },
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
    multi: true,
    deps: [AppConfigService]
  }
];

export const testBawServices = [
  ...testAppInitializer,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  { provide: STUB_CLASS_BUILDER, useValue: MockModel },
  { provide: BawApiService, useClass: MockBawApiService },
  { provide: SecurityService, useClass: MockSecurityService },
  { provide: AccountService, useClass: MockReadonlyApiService },
  { provide: ProjectsService, useClass: MockStandardApiService },
  { provide: SitesService, useClass: MockStandardApiService },
  { provide: ShallowSitesService, useClass: MockStandardApiService },
  { provide: UserService, useClass: MockShowApiService }
];
