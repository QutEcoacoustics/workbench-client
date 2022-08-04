import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { CmsService } from "@baw-api/cms/cms.service";
import { MayBeAsync } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel, AbstractModelConstructor } from "@models/AbstractModel";
import { mockProvider, Spectator, SpectatorService } from "@ngneat/spectator";
import { CacheModule } from "@services/cache/cache.module";
import { MockConfigModule } from "@services/config/configMock.module";
import { CmsComponent } from "@shared/cms/cms.component";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  ApiCreate,
  ApiDestroy,
  ApiFilter,
  ApiList,
  ApiShow,
  ApiUpdate,
  ImmutableApi,
  NonDestructibleApi,
  ReadAndCreateApi,
  ReadAndUpdateApi,
  ReadonlyApi,
  StandardApi,
} from "../../services/baw-api/api-common";
import { BawApiService, Filters } from "../../services/baw-api/baw-api.service";
import { getCallArgs } from "./general";

export const mockServiceImports = [
  MockConfigModule,
  HttpClientTestingModule,
  CacheModule,
];

export const mockServiceProviders = [
  BawApiService,
  BawFormApiService,
  BawSessionService,
  mockProvider(ToastrService),
];

type CustomList<Model extends AbstractModel, Params extends any[]> = (
  ...urlParameters: Params
) => Observable<Model[]>;

type CustomFilter<Model extends AbstractModel, Params extends any[]> = (
  filters: Filters<Model>,
  ...urlParameters: Params
) => Observable<Model[]>;

export const defaultFilters: Filters<AbstractModel> = {
  filter: {},
  projection: {},
  sorting: { orderBy: "id", direction: "asc" },
  paging: {},
};

export function validateApiList<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiList<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  ...parameters: Params
): void {
  const key: keyof Service = "list";

  validateCustomApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    endpoint,
    key as any,
    ...parameters
  );
}

export function validateApiFilter<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiFilter<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  ...parameters: Params
): void {
  const key: keyof Service = "filter";
  const filter = undefined;
  const models = undefined;

  validateCustomApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    endpoint,
    key as any,
    filter,
    models,
    ...parameters
  );
}

export function validateApiShow<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiShow<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  id: Id,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Show", () => {
    let api: BawApiService<Model>;
    let service: Service;
    let testModel: Model;

    beforeEach(() => {
      const spec = createService();
      testModel = model();
      service = spec.service;
      api = spec.inject<BawApiService<Model>>(BawApiService);
      spyOn(api, "show").and.callFake(
        () => new BehaviorSubject<Model>(testModel)
      );
    });

    it("should handle show endpoint using model", () => {
      service.show(testModel, ...parameters).subscribe();
      expect(api.show).toHaveBeenCalledWith(modelBuilder, endpoint);
    });

    // Some services do not accept an id parameter
    if (isInstantiated(id)) {
      it("should handle show endpoint using id", () => {
        service.show(id, ...parameters).subscribe();
        expect(api.show).toHaveBeenCalledWith(modelBuilder, endpoint);
      });
    }
  });
}

export function validateApiCreate<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiCreate<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  createEndpoint: string,
  updateEndpoint: string,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Create", () => {
    let spec: SpectatorService<Service>;

    beforeEach(() => {
      spec = createService();
    });

    it("should handle create endpoint", () => {
      const testModel = model();
      const service = spec.service;
      const api: BawApiService<Model> =
        spec.inject<BawApiService<Model>>(BawApiService);
      spyOn(api, "create").and.callFake(
        () => new BehaviorSubject<Model>(testModel)
      );
      service.create(testModel, ...parameters).subscribe();

      const args = getCallArgs(api.create as jasmine.Spy);
      expect(args[0]).toBe(modelBuilder);
      expect(args[1]).toBe(createEndpoint);
      expect(args[2](testModel)).toBe(updateEndpoint);
      expect(args[3]).toBe(testModel);
    });
  });
}

export function validateApiUpdate<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiUpdate<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Update", (): void => {
    it("should handle update endpoint", (): void => {
      const spec = createService();
      const testModel = model();
      const service = spec.service;
      const api: BawApiService<Model> =
        spec.inject<BawApiService<Model>>(BawApiService);
      spyOn(api, "update").and.callFake(
        () => new BehaviorSubject<Model>(testModel)
      );
      service.update(testModel, ...parameters).subscribe();

      expect(api.update).toHaveBeenCalledWith(
        modelBuilder,
        endpoint,
        testModel
      );
    });
  });
}

export function validateApiDestroy<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiDestroy<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  endpoint: string,
  id: Id,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Destroy", (): void => {
    let api: BawApiService<Model>;
    let service: Service;
    let testModel: Model;

    beforeEach(() => {
      const spec = createService();
      testModel = model();
      service = spec.service;
      api = spec.inject<BawApiService<Model>>(BawApiService);
      spyOn(api, "destroy").and.callFake(() => new BehaviorSubject<null>(null));
    });

    it("should handle destroy endpoint using model", () => {
      service.destroy(testModel, ...parameters).subscribe();
      expect(api.destroy).toHaveBeenCalledWith(endpoint);
    });

    it("should handle destroy endpoint using id", () => {
      service.destroy(id, ...parameters).subscribe();
      expect(api.destroy).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function assertCms<Component>(
  setup: () => MayBeAsync<Spectator<Component>>,
  endpoint: string
): void {
  let spectator: Spectator<Component>;

  describe("cms for " + endpoint, (): void => {
    beforeEach(async () => {
      spectator = await setup();
      const cmsService = spectator.inject(CmsService);
      cmsService.get.and.callFake(() => new Subject());
    });

    function getCms() {
      return spectator.query(CmsComponent);
    }

    it("should have cms page", async () => {
      spectator.detectChanges();
      expect(getCms()).toBeTruthy();
    });

    it("should load plaintext cms", async () => {
      spectator.detectChanges();
      expect(getCms().page).toBe(endpoint);
    });
  });
}

export function validateCustomApiList<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiList<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  key: keyof Service,
  ...parameters: Params
): void {
  describe(`Api List (${key.toString()})`, (): void => {
    it("should handle list endpoint", (): void => {
      const spec = createService();
      const service = spec.service;
      const api: BawApiService<Model> =
        spec.inject<BawApiService<Model>>(BawApiService);
      spyOn(api, "list").and.callFake(() => new BehaviorSubject<Model[]>([]));

      (service[key as any] as CustomList<Model, Params>)(
        ...parameters
      ).subscribe();
      expect(api.list).toHaveBeenCalledWith(modelBuilder, endpoint);
    });
  });
}

export function validateCustomApiFilter<
  Model extends AbstractModel,
  Params extends any[],
  Service
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  key: keyof Service,
  filters: Filters<Model> = {},
  models: () => Model[] = () => [],
  ...parameters: Params
): void {
  describe(`Api Filter (${key.toString()})`, (): void => {
    it("should handle filter endpoint", (): void => {
      const spec = createService();
      const testModels = models();
      const service = spec.service;
      const api: BawApiService<Model> =
        spec.inject<BawApiService<Model>>(BawApiService);
      const expectedFilters: Filters<Model> = { ...defaultFilters, ...filters };
      spyOn(api, "filter").and.callFake(
        () => new BehaviorSubject<Model[]>(testModels)
      );
      (service[key as any] as CustomFilter<Model, Params>)(
        defaultFilters,
        ...parameters
      ).subscribe();

      expect(api.filter).toHaveBeenCalledWith(
        modelBuilder,
        endpoint,
        expectedFilters
      );
    });
  });
}

export function validateStandardApi<
  Model extends AbstractModel,
  Params extends any[],
  Service extends StandardApi<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiUpdate<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiDestroy<Model, Params, Service>(
    createService,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
}

export function validateImmutableApi<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ImmutableApi<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiDestroy<Model, Params, Service>(
    createService,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
}

export function validateReadonlyApi<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ReadonlyApi<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
}

export function validateReadAndCreateApi<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ReadAndCreateApi<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
}

export function validateReadAndUpdateApi<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ReadAndUpdateApi<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiUpdate<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    model,
    ...parameters
  );
}

export function validateNonDestructableApi<
  Model extends AbstractModel,
  Params extends any[],
  Service extends NonDestructibleApi<Model, Params>
>(
  createService: () => SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    createService,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    createService,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiUpdate<Model, Params, Service>(
    createService,
    modelBuilder,
    modelEndpoint,
    model,
    ...parameters
  );
}
