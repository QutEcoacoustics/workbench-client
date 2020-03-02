import { TestBed } from "@angular/core/testing";
import { fromJS } from "immutable";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { toastrRoot } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import {
  API_CONFIG,
  API_ROOT,
  CMS_ROOT,
  Configuration
} from "src/app/helpers/app-initializer/app-initializer";
import { environment } from "src/environments/environment";
import { AppConfigService } from "./app-config.service";
import { testApiConfig } from "./appConfigMock.service";

describe("AppConfigService", () => {
  let service: AppConfigService;
  let toastr: ToastrService;
  let tempEnvironment: any;

  // Save environment to variable
  beforeAll(() => {
    tempEnvironment = fromJS(environment).toJS();
  });

  // Clear environment before each test
  beforeEach(() => {
    for (const key of Object.keys(environment)) {
      delete environment[key];
    }
    Object.assign(environment, fromJS(tempEnvironment).toJS());
  });

  // Clear toastr notifications
  afterEach(() => {
    toastr.clear();
  });

  // Reset environment to state before tests
  afterAll(() => {
    for (const key of Object.keys(environment)) {
      delete environment[key];
    }
    Object.assign(environment, fromJS(tempEnvironment).toJS());
  });

  function configureTestingModule(
    apiRoot: string = testApiConfig.environment.apiRoot,
    cmsRoot: string = testApiConfig.environment.cmsRoot,
    apiConfig: Partial<Configuration> = testApiConfig
  ) {
    TestBed.configureTestingModule({
      imports: [SharedModule, ToastrModule.forRoot(toastrRoot)],
      providers: [
        {
          provide: API_ROOT,
          useValue: apiRoot
        },
        {
          provide: CMS_ROOT,
          useValue: cmsRoot
        },
        {
          provide: API_CONFIG,
          useValue: new Promise(resolve => {
            Object.assign(environment, apiConfig);
            resolve(apiConfig);
          })
        },
        AppConfigService
      ]
    });

    toastr = TestBed.inject(ToastrService);
    spyOn(toastr, "error").and.callThrough();

    service = TestBed.inject(AppConfigService);
  }

  it("should be created", () => {
    configureTestingModule();
    expect(service).toBeTruthy();
  });

  it("should get config", () => {
    configureTestingModule();
    expect(service.config).toEqual(Object.assign(environment, testApiConfig));
  });

  it("should get environment", () => {
    configureTestingModule();
    expect(service.environment).toEqual(testApiConfig.environment);
  });

  it("should get values", () => {
    configureTestingModule();
    expect(service.values).toEqual(testApiConfig.values);
  });

  it("should create warning message on failed config", () => {
    configureTestingModule("", "", {});

    expect(toastr.error).toHaveBeenCalledWith(
      "The website is not configured correctly. Try coming back at another time.",
      "Unrecoverable Error",
      {
        closeButton: false,
        disableTimeOut: true,
        tapToDismiss: false,
        positionClass: "toast-center-center"
      }
    );
  });
});
