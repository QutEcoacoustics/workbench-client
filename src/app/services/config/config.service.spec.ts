import { provideHttpClientTesting } from "@angular/common/http/testing";
import { IConfiguration } from "@helpers/app-initializer/app-initializer";
import { createHttpFactory, HttpMethod, mockProvider, SpectatorHttp } from "@ngneat/spectator";
import { ToastService } from "@services/toasts/toasts.service";
import { environment } from "src/environments/environment";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { API_CONFIG, API_ROOT } from "./config.tokens";
import { testApiConfig } from "./configMock.service";

describe("ConfigService", () => {
  let spec: SpectatorHttp<ConfigService>;
  let service: ConfigService;
  let toastr: ToastService;
  const createService = createHttpFactory({
    service: ConfigService,
    providers: [mockProvider(ToastService), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
  });

  async function setup(
    apiRoot: string = testApiConfig.endpoints.apiRoot,
    apiConfig: Partial<IConfiguration> = testApiConfig,
  ): Promise<void> {
    spec = createService({
      providers: [{ provide: API_ROOT, useValue: apiRoot }],
    });

    toastr = spec.inject(ToastService);
    service = spec.inject(ConfigService);

    const promise = spec.service.init();
    const req = spec.expectOne("assets/environment.json", HttpMethod.GET);
    req.flush(apiConfig);
    await promise;
  }

  async function setupWithDefaultConfig(
    apiRoot: string = testApiConfig.endpoints.apiRoot,
    apiConfig: Partial<IConfiguration> = testApiConfig,
  ): Promise<void> {
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

    toastr = spec.inject(ToastService);
    service = spec.inject(ConfigService);

    await spec.service.init(spec.inject(API_CONFIG));
  }

  [
    {
      description: "with default config",
      before: async (apiRoot?: string, apiConfig?: Partial<IConfiguration>): Promise<void> =>
        await setupWithDefaultConfig(apiRoot, apiConfig),
      after: (): void => {},
    },
    {
      description: "without default config",
      before: async (apiRoot?: string, apiConfig?: Partial<IConfiguration>): Promise<void> =>
        await setup(apiRoot, apiConfig),
      after: (): void => {},
    },
  ].forEach(({ description, before, after }) => {
    describe(description, () => {
      afterEach(() => after());

      it("should be created", async () => {
        await before();
        expect(service).toBeTruthy();
      });

      it("should be created", async () => {
        await before();
        expect(service).toBeTruthy();
      });

      it("should get config", async () => {
        await before();
        expect(service.config).toEqual(testApiConfig);
      });

      it("should get endpoints", async () => {
        await before();
        expect(service.endpoints).toEqual(testApiConfig.endpoints);
      });

      it("should get keys", async () => {
        await before();
        expect(service.keys).toEqual(testApiConfig.keys);
      });

      it("should get settings", async () => {
        await before();
        expect(service.settings).toEqual(testApiConfig.settings);
      });

      it("should create warning message on failed config", async () => {
        await before("", {});

        expect(toastr.error).toHaveBeenCalledWith(
          "The website is not configured correctly. Try coming back at another time.",
          "Unrecoverable Error",
          { autoHide: false },
        );
      });
    });
  });
});
