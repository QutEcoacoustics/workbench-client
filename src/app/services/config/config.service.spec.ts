import { Configuration } from "@helpers/app-initializer/app-initializer";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockToastrService } from "@test/helpers/toastr";
import { fromJS } from "immutable";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { ConfigService } from "./config.service";
import { API_CONFIG, API_ROOT } from "./config.tokens";
import { testApiConfig } from "./configMock.service";

describe("ConfigService", () => {
  let spec: SpectatorService<ConfigService>;
  let service: ConfigService;
  let toastr: ToastrService;
  let tempEnvironment: any;
  const createService = createServiceFactory({
    service: ConfigService,
    providers: [MockToastrService],
  });

  // Save environment to variable
  beforeAll(() => {
    tempEnvironment = (fromJS(environment) as any).toJS();
  });

  // Clear environment before each test
  beforeEach(() => {
    for (const key of Object.keys(environment)) {
      delete environment[key];
    }
    Object.assign(environment, (fromJS(tempEnvironment) as any).toJS());
  });

  // Reset environment to state before tests
  afterAll(() => {
    for (const key of Object.keys(environment)) {
      delete environment[key];
    }
    Object.assign(environment, (fromJS(tempEnvironment) as any).toJS());
  });

  function setup(apiRoot: string = testApiConfig.endpoints.apiRoot): void {
    spec = createService({
      providers: [{ provide: API_ROOT, useValue: apiRoot }],
    });

    toastr = spec.inject(ToastrService);
    service = spec.inject(ConfigService);
  }

  function setupWithDefaultConfig(
    apiRoot: string = testApiConfig.endpoints.apiRoot,
    apiConfig: Partial<Configuration> = testApiConfig
  ): void {
    spec = createService({
      providers: [
        { provide: API_ROOT, useValue: apiRoot },
        {
          provide: API_CONFIG,
          useValue: new Promise((resolve) => {
            Object.assign(environment, apiConfig);
            resolve(apiConfig);
          }),
        },
      ],
    });

    toastr = spec.inject(ToastrService);
    service = spec.inject(ConfigService);
  }

  [
    {
      description: "with default config",
      before: async (
        apiRoot?: string,
        apiConfig?: Partial<Configuration>
      ): Promise<void> => setupWithDefaultConfig(apiRoot, apiConfig),
      after: (): void => {},
    },
    {
      description: "without default config",
      before: async (
        apiRoot?: string,
        apiConfig?: Partial<Configuration>
      ): Promise<void> => {
        setup(apiRoot);
      },
      after: (): void => {},
    },
  ].forEach(({ description, before, after }) => {
    afterEach(() => after());

    it("should be created", () => {
      before();
      expect(service).toBeTruthy();
    });
  });

  it("should be created", () => {
    setupWithDefaultConfig();
    expect(service).toBeTruthy();
  });

  it("should get config", () => {
    setupWithDefaultConfig();
    expect(service.config).toEqual(Object.assign(environment, testApiConfig));
  });

  it("should get endpoints", () => {
    setupWithDefaultConfig();
    expect(service.endpoints).toEqual(testApiConfig.endpoints);
  });

  it("should get keys", () => {
    setupWithDefaultConfig();
    expect(service.keys).toEqual(testApiConfig.keys);
  });

  it("should get settings", () => {
    setupWithDefaultConfig();
    expect(service.settings).toEqual(testApiConfig.settings);
  });

  it("should create warning message on failed config", () => {
    setupWithDefaultConfig("", {});

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
