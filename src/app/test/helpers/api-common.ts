import { CmsService } from "@baw-api/cms/cms.service";
import { KeysOfType, MayBeAsync } from "@helpers/advancedTypes";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel, AbstractModelConstructor } from "@models/AbstractModel";
import { Spectator, SpectatorService, SpyObject } from "@ngneat/spectator";
import { CmsComponent } from "@shared/cms/cms.component";
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  ...parameters: Params
): void {
  const key: keyof Service = "list";

  validateCustomApiList<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  ...parameters: Params
): void {
  const key: keyof Service = "filter";
  const filter = undefined;
  const models = undefined;

  validateCustomApiFilter<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  id: Id,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Show", () => {
    let api: SpyObject<BawApiService<Model>>;
    let service: Service;
    let testModel: Model;

    beforeEach(() => {
      testModel = model();
      service = spec.service;
      api = spec.inject<BawApiService<Model>>(BawApiService);
      api.show.and.callFake(() => new BehaviorSubject<Model>(testModel));
    });

    it("should handle show endpoint using model", () => {
      service.show(testModel, ...parameters).subscribe();
      expect(api.show).toHaveBeenCalledWith(modelBuilder, endpoint);
    });

    it("should handle show endpoint using id", () => {
      service.show(id, ...parameters).subscribe();
      expect(api.show).toHaveBeenCalledWith(modelBuilder, endpoint);
    });
  });
}

export function validateApiCreate<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiCreate<Model, Params>
>(
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  createEndpoint: string,
  updateEndpoint: string,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Create", () => {
    beforeEach(() => {});

    it("should handle create endpoint", () => {
      const testModel = model();
      const service = spec.service;
      const api = spec.inject<BawApiService<Model>>(BawApiService);
      api.create.and.callFake(() => new BehaviorSubject<Model>(testModel));
      service.create(testModel, ...parameters).subscribe();

      const args = getCallArgs(api.create);
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Update", (): void => {
    it("should handle update endpoint", (): void => {
      const testModel = model();
      const service = spec.service;
      const api = spec.inject<BawApiService<Model>>(BawApiService);
      api.update.and.callFake(() => new BehaviorSubject<Model>(testModel));
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
  spec: SpectatorService<Service>,
  endpoint: string,
  id: Id,
  model: () => Model,
  ...parameters: Params
): void {
  describe("Api Destroy", (): void => {
    let api: SpyObject<BawApiService<Model>>;
    let service: Service;
    let testModel: Model;

    beforeEach(() => {
      testModel = model();
      service = spec.service;
      api = spec.inject<BawApiService<Model>>(BawApiService);
      api.destroy.and.callFake(() => new BehaviorSubject<Model>(null));
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  list: KeysOfType<Service, CustomList<Model, Params>>,
  ...parameters: Params
): void {
  describe(`Api List (${list})`, (): void => {
    it("should handle list endpoint", (): void => {
      const service = spec.service;
      const api = spec.inject<BawApiService<Model>>(BawApiService);
      api.list.and.callFake(() => new BehaviorSubject<Model[]>([]));

      (service[list as any] as CustomList<Model, Params>)(
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  endpoint: string,
  filter: KeysOfType<Service, CustomFilter<Model, Params>>,
  filters: Filters<Model> = {},
  models: () => Model[] = () => [],
  ...parameters: Params
): void {
  describe(`Api Filter (${filter})`, (): void => {
    it("should handle filter endpoint", (): void => {
      const testModels = models();
      const service = spec.service;
      const api = spec.inject<BawApiService<Model>>(BawApiService);
      const expectedFilters: Filters<Model> = { ...defaultFilters, ...filters };
      api.filter.and.callFake(() => new BehaviorSubject<Model[]>(testModels));

      (service[filter as any] as CustomFilter<Model, Params>)(
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  modelEndpoint: string,
  filterEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    spec,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiUpdate<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiDestroy<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  modelEndpoint: string,
  filterEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    spec,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiDestroy<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  filterEndpoint: string,
  modelEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    spec,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  modelEndpoint: string,
  filterEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    spec,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  modelEndpoint: string,
  filterEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    spec,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiUpdate<Model, Params, Service>(
    spec,
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
  spec: SpectatorService<Service>,
  modelBuilder: AbstractModelConstructor<Model>,
  baseEndpoint: string,
  modelEndpoint: string,
  filterEndpoint: string,
  model: () => Model,
  modelId: number,
  ...parameters: Params
): void {
  validateApiList<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    ...parameters
  );
  validateApiFilter<Model, Params, Service>(
    spec,
    modelBuilder,
    filterEndpoint,
    ...parameters
  );
  validateApiShow<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    modelId,
    model,
    ...parameters
  );
  validateApiCreate<Model, Params, Service>(
    spec,
    modelBuilder,
    baseEndpoint,
    modelEndpoint,
    model,
    ...parameters
  );
  validateApiUpdate<Model, Params, Service>(
    spec,
    modelBuilder,
    modelEndpoint,
    model,
    ...parameters
  );
}
