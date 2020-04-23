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
} from "./api-common";
import { Filters } from "./baw-api.service";

export const defaultFilters: Filters = {
  filter: {},
  projection: {
    include: [],
    exclude: [],
  },
  sorting: { orderBy: "id", direction: "asc" },
  paging: {},
};

export function validateApiList<
  M extends AbstractModel,
  S extends ApiList<M, any[]>
>(endpoint: string, models: M[] = []) {
  describe("Api List", function () {
    it("should handle list endpoint", function () {
      const api: S = this.service as S;
      api["apiList"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M[]>(models));
      api.list().subscribe();
      expect(api["apiList"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function validateApiFilter<
  M extends AbstractModel,
  S extends ApiFilter<M, any[]>
>(endpoint: string, models: M[] = [], filters: Filters = defaultFilters) {
  describe("Api Filter", function () {
    it("should handle filter endpoint", function () {
      const api: S = this.service as S;
      api["apiFilter"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M[]>(models));
      api.filter(filters).subscribe();
      expect(api["apiFilter"]).toHaveBeenCalledWith(endpoint, filters);
    });
  });
}

export function validateApiShow<
  M extends AbstractModel,
  S extends ApiShow<M, any[], IdOr<M>>
>(endpoint: string, id: Id, model: M) {
  describe("Api Show", function () {
    let api: S;

    beforeEach(function () {
      api = this.service as S;
      api["apiShow"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(model));
    });

    it("should handle show endpoint using model", function () {
      api.show(model).subscribe();
      expect(api["apiShow"]).toHaveBeenCalledWith(endpoint);
    });

    it("should handle show endpoint using id", function () {
      api.show(id).subscribe();
      expect(api["apiShow"]).toHaveBeenCalledWith(endpoint);
    });
  });
}

export function validateApiCreate<
  M extends AbstractModel,
  S extends ApiCreate<M, any[]>
>(endpoint: string, model: M) {
  describe("Api Create", function () {
    it("should handle create endpoint", function () {
      const api: S = this.service as S;
      api["apiCreate"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(model));
      api.create(model).subscribe();
      expect(api["apiCreate"]).toHaveBeenCalledWith(endpoint, model);
    });
  });
}

export function validateApiUpdate<
  M extends AbstractModel,
  S extends ApiUpdate<M, any[]>
>(endpoint: string, model: M) {
  describe("Api Update", function () {
    it("should handle update endpoint", function () {
      const api: S = this.service as S;
      api["apiUpdate"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(model));
      api.update(model).subscribe();
      expect(api["apiUpdate"]).toHaveBeenCalledWith(endpoint, model);
    });
  });
}

export function validateApiDestroy<
  M extends AbstractModel,
  S extends ApiDestroy<M, any[], IdOr<M>>
>(endpoint: string, id: Id, model: M) {
  describe("Api Destroy", function () {
    let api: S;

    beforeEach(function () {
      api = this.service as S;
      api["apiDestroy"] = jasmine
        .createSpy()
        .and.callFake(() => new BehaviorSubject<M>(null));
    });

    it("should handle destroy endpoint using model", function () {
      api.destroy(model).subscribe();
      expect(api["apiDestroy"]).toHaveBeenCalledWith(endpoint);
    });

    it("should handle destroy endpoint using id", function () {
      api.destroy(id).subscribe();
      expect(api["apiDestroy"]).toHaveBeenCalledWith(endpoint);
    });
  });
}
