import { TestBed } from "@angular/core/testing";
import {
  API_CONFIG,
  API_ROOT,
  Configuration,
} from "@helpers/app-initializer/app-initializer";
import { SharedModule } from "@shared/shared.module";
import { fromJS } from "immutable";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { toastrRoot } from "src/app/app.helper";
import { environment } from "src/environments/environment";
import { ConfigService } from "./config.service";
import { testApiConfig } from "./configMock.service";

describe("AppConfigService", () => {
  let service: ConfigService;
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
    apiRoot: string = testApiConfig.endpoints.apiRoot,
    apiConfig: Partial<Configuration> = testApiConfig
  ) {
    TestBed.configureTestingModule({
      imports: [SharedModule, ToastrModule.forRoot(toastrRoot)],
      providers: [
        {
          provide: API_ROOT,
          useValue: apiRoot,
        },
        {
          provide: API_CONFIG,
          useValue: new Promise((resolve) => {
            Object.assign(environment, apiConfig);
            resolve(apiConfig);
          }),
        },
        ConfigService,
      ],
    });

    toastr = TestBed.inject(ToastrService);
    spyOn(toastr, "error").and.callThrough();

    service = TestBed.inject(ConfigService);
  }

  it("should be created", () => {
    configureTestingModule();
    expect(service).toBeTruthy();
  });

  it("should get config", () => {
    configureTestingModule();
    expect(service.config).toEqual(Object.assign(environment, testApiConfig));
  });

  it("should get endpoints", () => {
    configureTestingModule();
    expect(service.endpoints).toEqual(testApiConfig.endpoints);
  });

  it("should get keys", () => {
    configureTestingModule();
    expect(service.keys).toEqual(testApiConfig.keys);
  });

  it("should get settings", () => {
    configureTestingModule();
    expect(service.settings).toEqual(testApiConfig.settings);
  });

  it("should create warning message on failed config", () => {
    configureTestingModule("", {});

    expect(toastr.error).toHaveBeenCalledWith(
      "The website is not configured correctly. Try coming back at another time.",
      "Unrecoverable Error",
      {
        closeButton: false,
        disableTimeOut: true,
        tapToDismiss: false,
        positionClass: "toast-center-center",
      }
    );
  });
});
