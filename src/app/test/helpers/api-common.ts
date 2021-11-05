import { CmsService } from "@baw-api/cms/cms.service";
import { KeysOfType, MayBeAsync } from "@helpers/advancedTypes";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Spectator } from "@ngneat/spectator";
import { CmsComponent } from "@shared/cms/cms.component";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  ApiCreate,
  ApiDestroy,
  ApiFilter,
  ApiList,
  ApiShow,
  ApiUpdate,
} from "../../services/baw-api/api-common";
import { BawApiService, Filters } from "../../services/baw-api/baw-api.service";

type CustomList<Model extends AbstractModel, Params extends any[]> = (
  ...urlParameters: Params
) => Observable<Model[]>;

type CustomFilter<Model extends AbstractModel, Params extends any[]> = (
  filters: Filters<Model>,
  ...urlParameters: Params
) => Observable<Model[]>;

type ServiceType<Model extends AbstractModel, Service> = Service &
  BawApiService<Model>;

export const defaultFilters: Filters<AbstractModel> = {
  filter: {},
  projection: {},
  sorting: { orderBy: "id", direction: "asc" },
  paging: {},
};

export function validateApiList<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ServiceType<Model, ApiList<Model, Params>>
>(endpoint: string, ...parameters: Params) {
  const key: keyof Service = "list";

  validateCustomApiList<Model, Params, Service>(
    endpoint,
    key as any,
    ...parameters
  );
}

export function validateApiFilter<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ServiceType<Model, ApiFilter<Model, Params>>
>(endpoint: string, ...parameters: Params) {
  const key: keyof Service = "filter";
  const filter = undefined;
  const models = undefined;

  validateCustomApiFilter<Model, Params, Service>(
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
  Service extends ServiceType<Model, ApiShow<Model, Params>>
>(endpoint: string, id: Id, model: () => Model, ...parameters: Params) {
  describe("Api Show", function () {
    let api: Service;
    let testModel: Model;

    beforeEach(function () {
      testModel = model();
      api = this.service;
      api["apiShow"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model>(testModel));
    });

    it("should handle show endpoint using model", function () {
      api.show(testModel, ...parameters).subscribe();
      expect(api["apiShow"]).toHaveBeenCalledWith(endpoint);
    });

    it("should handle show endpoint using id", function () {
      api.show(id, ...parameters).subscribe();
      expect(api["apiShow"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function validateApiCreate<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ServiceType<Model, ApiCreate<Model, Params>>
>(endpoint: string, model: () => Model, ...parameters: Params) {
  describe("Api Create", function () {
    let testModel: Model;

    beforeEach(function () {
      testModel = model();
    });

    it("should handle create endpoint", function () {
      const api: Service = this.service;
      api["apiCreate"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model>(testModel));
      api.create(testModel, ...parameters).subscribe();

      expect(api["apiCreate"]).toHaveBeenCalledWith(endpoint, testModel);
    });
  });
}

export function validateApiCreateMultipart<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ServiceType<Model, ApiCreate<Model, Params>>
>(createEndpoint: string, model: () => Model, ...parameters: Params) {
  describe("Api Create", function () {
    let testModel: Model;

    beforeEach(function () {
      testModel = model();
    });

    it("should handle create endpoint", function () {
      const api: Service = this.service;
      api["apiCreateMultipart"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model>(testModel));
      api.create(testModel, ...parameters).subscribe();

      expect(api["apiCreateMultipart"]).toHaveBeenCalledWith(
        createEndpoint,
        jasmine.any(Function),
        testModel
      );
    });
  });
}

export function validateApiUpdate<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ServiceType<Model, ApiUpdate<Model, Params>>
>(endpoint: string, model: () => Model, ...parameters: Params) {
  describe("Api Update", function () {
    let testModel: Model;

    beforeEach(function () {
      testModel = model();
    });

    it("should handle update endpoint", function () {
      const api: Service = this.service;
      api["apiUpdate"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model>(testModel));
      api.update(testModel, ...parameters).subscribe();

      expect(api["apiUpdate"]).toHaveBeenCalledWith(endpoint, testModel);
    });
  });
}

export function validateApiDestroy<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ServiceType<Model, ApiDestroy<Model, Params>>
>(endpoint: string, id: Id, model: () => Model, ...parameters: Params) {
  describe("Api Destroy", function () {
    let api: Service;
    let testModel: Model;

    beforeEach(function () {
      testModel = model();
      api = this.service;
      api["apiDestroy"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model>(null));
    });

    it("should handle destroy endpoint using model", function () {
      api.destroy(testModel, ...parameters).subscribe();
      expect(api["apiDestroy"]).toHaveBeenCalledWith(endpoint);
    });

    it("should handle destroy endpoint using id", function () {
      api.destroy(id, ...parameters).subscribe();
      expect(api["apiDestroy"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function assertCms<Component>(
  setup: () => MayBeAsync<Spectator<Component>>,
  endpoint: string
) {
  let spectator: Spectator<Component>;

  describe("cms for " + endpoint, () => {
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
  Service extends ServiceType<Model, ApiList<Model, Params>>
>(
  endpoint: string,
  list: KeysOfType<Service, CustomList<Model, Params>>,
  ...parameters: Params
) {
  describe(`Api List (${list})`, function () {
    it("should handle list endpoint", function () {
      const api: Service = this.service;

      api["apiList"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model[]>([]));
      (api[list as any] as CustomList<Model, Params>)(
        ...parameters
      ).subscribe();
      expect(api["apiList"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function validateCustomApiFilter<
  Model extends AbstractModel,
  Params extends any[],
  Service extends BawApiService<Model>
>(
  endpoint: string,
  filter: KeysOfType<Service, CustomFilter<Model, Params>>,
  filters: Filters<Model> = {},
  models: () => Model[] = () => [],
  ...parameters: Params
) {
  describe(`Api Filter (${filter})`, function () {
    let testModels: Model[];

    beforeEach(function () {
      testModels = models();
    });

    it("should handle filter endpoint", function () {
      const api: Service = this.service;
      const expectedFilters: Filters<Model> = { ...defaultFilters, ...filters };

      api["apiFilter"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<Model[]>(testModels));
      (api[filter as any] as CustomFilter<Model, Params>)(
        defaultFilters,
        ...parameters
      ).subscribe();

      expect(api["apiFilter"]).toHaveBeenCalledWith(endpoint, expectedFilters);
    });
  });
}
