import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { BehaviorSubject } from "rxjs";
import {
  ApiCreate,
  ApiDestroy,
  ApiFilter,
  ApiList,
  ApiShow,
  ApiUpdate,
  IdOr,
} from "../../services/baw-api/api-common";
import { Filters } from "../../services/baw-api/baw-api.service";

export const defaultFilters: Filters = {
  filter: {},
  projection: {},
  sorting: { orderBy: "id", direction: "asc" },
  paging: {},
};

export function validateApiList<
  M extends AbstractModel,
  S extends ApiList<M, any[]>
>(endpoint: string, models: M[] = [], ...parameters: any[]) {
  describe("Api List", function () {
    it("should handle list endpoint", function () {
      const api: S = this.service;
      api["apiList"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M[]>(models));
      api.list(...parameters).subscribe();

      expect(api["apiList"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function validateApiFilter<
  M extends AbstractModel,
  S extends ApiFilter<M, any[]>
>(
  endpoint: string,
  models: M[] = [],
  filters: Filters = defaultFilters,
  ...parameters: any[]
) {
  describe("Api Filter", function () {
    it("should handle filter endpoint", function () {
      const api: S = this.service;
      api["apiFilter"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M[]>(models));
      api.filter(filters, ...parameters).subscribe();

      expect(api["apiFilter"]).toHaveBeenCalledWith(endpoint, filters);
    });
  });
}

export function validateApiShow<
  M extends AbstractModel,
  S extends ApiShow<M, any[], IdOr<M>>
>(endpoint: string, id: Id, model: M, ...parameters: any[]) {
  describe("Api Show", function () {
    let api: S;

    beforeEach(function () {
      api = this.service;
      api["apiShow"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(model));
    });

    it("should handle show endpoint using model", function () {
      api.show(model, ...parameters).subscribe();
      expect(api["apiShow"]).toHaveBeenCalledWith(endpoint);
    });

    it("should handle show endpoint using id", function () {
      api.show(id, ...parameters).subscribe();
      expect(api["apiShow"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function validateApiCreate<
  M extends AbstractModel,
  S extends ApiCreate<M, any[]>
>(endpoint: string, model: M, ...parameters: any[]) {
  describe("Api Create", function () {
    it("should handle create endpoint", function () {
      const api: S = this.service;
      api["apiCreate"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(model));
      api.create(model, ...parameters).subscribe();

      expect(api["apiCreate"]).toHaveBeenCalledWith(endpoint, model);
    });
  });
}

export function validateApiUpdate<
  M extends AbstractModel,
  S extends ApiUpdate<M, any[]>
>(endpoint: string, model: M, ...parameters: any[]) {
  describe("Api Update", function () {
    it("should handle update endpoint", function () {
      const api: S = this.service;
      api["apiUpdate"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(model));
      api.update(model, ...parameters).subscribe();

      expect(api["apiUpdate"]).toHaveBeenCalledWith(endpoint, model);
    });
  });
}

export function validateApiDestroy<
  M extends AbstractModel,
  S extends ApiDestroy<M, any[], IdOr<M>>
>(endpoint: string, id: Id, model: M, ...parameters: any[]) {
  describe("Api Destroy", function () {
    let api: S;

    beforeEach(function () {
      api = this.service;
      api["apiDestroy"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(null));
    });

    it("should handle destroy endpoint using model", function () {
      api.destroy(model, ...parameters).subscribe();
      expect(api["apiDestroy"]).toHaveBeenCalledWith(endpoint);
    });

    it("should handle destroy endpoint using id", function () {
      api.destroy(id, ...parameters).subscribe();
      expect(api["apiDestroy"]).toHaveBeenCalledWith(endpoint);
    });
  });
}
