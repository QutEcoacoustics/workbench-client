import { Component } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  defaultApiPageSize,
  Filters,
  InnerFilter,
} from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { Subject } from "rxjs";
import { PaginationTemplate } from "./paginationTemplate";

const queryKey = "query";
const pageKey = "page";

@Component({
  selector: "app-test",
  template: ``,
})
class MockComponent extends PaginationTemplate<Project> {
  constructor(
    router: Router,
    route: ActivatedRoute,
    config: NgbPaginationConfig,
    api: ProjectsService
  ) {
    super(
      router,
      route,
      config,
      api,
      "id",
      () => [],
      () => {}
    );
  }
}

describe("PaginationTemplate", () => {
  let api: SpyObject<ProjectsService>;
  let spectator: SpectatorRouting<MockComponent>;
  let component: MockComponent;
  const createComponent = createRoutingFactory({
    component: MockComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function setup(queryParams: Params = {}) {
    spectator = createComponent({ detectChanges: false, queryParams });
    component = spectator.component;
    api = spectator.inject(ProjectsService);
  }

  function interceptFilter(
    models: Project[] = [],
    error?: ApiErrorDetails,
    expectations?: (filters: Filters, ...args: any[]) => void
  ) {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(
      subject,
      () => (error ? error : models),
      !!error
    );
    api.filter.andCallFake((filters: Filters, ...args: any[]) => {
      expectations?.(filters, args);
      return subject;
    });
    return promise;
  }

  function generateFilter(page: number = 1, filterText?: string) {
    return {
      paging: { page },
      filter: filterText
        ? { [component["filterKey"]]: { contains: filterText } }
        : {},
    };
  }

  function generateModels(numModels: number): Project[] {
    const models: Project[] = [];
    for (let i = 0; i < Math.min(numModels, defaultApiPageSize); i++) {
      const site = new Project(generateProject());
      site.addMetadata({ paging: { total: numModels } });
      models.push(site);
    }
    return models;
  }

  describe("api", () => {
    beforeEach(() => {
      setup();
      interceptFilter();
    });

    it("should create filter request on load", () => {
      spectator.detectChanges();
      expect(api.filter).toHaveBeenCalled();
    });

    it("should create api filter request for first page on load", () => {
      spectator.detectChanges();
      expect(api.filter).toHaveBeenCalledWith(generateFilter(1));
    });

    it("should create api filter request with additional parameters", () => {
      component["apiParams"] = () => [1, 2, 3];
      spectator.detectChanges();
      expect(api.filter).toHaveBeenCalledWith(generateFilter(1), 1, 2, 3);
    });

    it("should create api filter request with default inner filter values", () => {
      const defaultFilter = { name: { eq: "custom name" } };
      component["_page"] = 1;
      component["defaultInnerFilter"] = () => defaultFilter;
      component.filter = "filter";
      expect(component["generateFilter"]()).toEqual({
        paging: { page: 1 },
        filter: { id: { contains: "filter" }, name: { eq: "custom name" } },
      });
    });

    it("should override default filter values if required", () => {
      const defaultFilter = { id: { eq: "custom id" } };
      component["_page"] = 1;
      component["defaultInnerFilter"] = () => defaultFilter;
      component.filter = "filter";
      expect(component["generateFilter"]()).toEqual({
        paging: { page: 1 },
        filter: { id: { contains: "filter" } },
      });
    });
  });

  describe("onInit", () => {
    it("should set pagination defaults", () => {
      setup();
      interceptFilter();
      spectator.detectChanges();

      expect(component["config"].maxSize).toBe(3);
      expect(component["config"].pageSize).toBe(defaultApiPageSize);
      expect(component["config"].rotate).toBe(true);
      expect(component.displayPagination).toBeFalsy();
    });

    it("should retrieve page number and filter from QSP", () => {
      setup({ [pageKey]: 5, [queryKey]: "custom filter" });
      interceptFilter();
      spectator.detectChanges();
      expect(component.page).toBe(5);
      expect(component.filter).toBe("custom filter");
    });

    it("should track changes to query parameters", () => {
      const spy = jasmine.createSpy();
      setup();
      interceptFilter();
      component["updateFromUrl"] = spy;
      spectator.detectChanges();
      spectator.triggerNavigation({ queryParams: { [pageKey]: 2 } });
      spectator.detectChanges();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe("apiRequest$", () => {
    function createApiRequest(page = 1, filterText = "") {
      component.apiRequest$.next({ page, filterText });
    }

    describe("startup", () => {
      it("should set loading to true", () => {
        setup();
        interceptFilter();
        spectator.detectChanges();
        createApiRequest();
        expect(component.loading).toBeTruthy();
      });

      it("should set page number", () => {
        setup();
        interceptFilter();
        spectator.detectChanges();
        createApiRequest(5);
        expect(component.page).toBe(5);
      });

      it("should set filter text", () => {
        setup();
        interceptFilter();
        spectator.detectChanges();
        createApiRequest(undefined, "custom filter");
        expect(component.filter).toBe("custom filter");
      });

      it("should update query parameters", () => {
        const spy = jasmine.createSpy();
        setup();
        interceptFilter();
        component["updateQueryParams"] = spy;
        spectator.detectChanges();
        createApiRequest(5, "custom filter");
        expect(spy).toHaveBeenCalledWith(5, "custom filter");
      });
    });

    describe("success", () => {
      it("should call getModels", async () => {
        const spy = jasmine.createSpy().and.callFake(() => new Subject());
        setup();
        interceptFilter();
        component["getModels"] = spy;
        spectator.detectChanges();
        createApiRequest();
        expect(spy).toHaveBeenCalled();
      });

      it("should set loading to false", async () => {
        setup();
        const promise = interceptFilter();
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.loading).toBeFalsy();
      });

      it("should set collectionSize to 0 if no models found", async () => {
        setup();
        const promise = interceptFilter([]);
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.collectionSize).toBe(0);
      });

      it("should set collectionSize to total number of models", async () => {
        setup();
        const promise = interceptFilter(generateModels(100));
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.collectionSize).toBe(100);
      });

      it("should set displayPagination to false if only 1 page of models exists", async () => {
        setup();
        const promise = interceptFilter(generateModels(25));
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.displayPagination).toBeFalsy();
      });

      it("should set displayPagination to true if more than 1 page of models exist", async () => {
        setup();
        const promise = interceptFilter(generateModels(26));
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.displayPagination).toBeTruthy();
      });
    });

    describe("failure", () => {
      it("should set error to api response", async () => {
        const error = generateApiErrorDetails();
        setup();
        const promise = interceptFilter(undefined, error);
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.error).toEqual(error);
      });

      it("should set loading to false", async () => {
        setup();
        const promise = interceptFilter(undefined, generateApiErrorDetails());
        spectator.detectChanges();
        createApiRequest();
        await promise;
        expect(component.loading).toBeFalsy();
      });
    });
  });

  describe("update on QSP change", () => {
    beforeEach(async () => {
      setup();
      const promise = interceptFilter();
      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
    });

    it("should set filter if exists in QSP", () => {
      spectator.setRouteQueryParam("query", "custom filter");
      expect(component.filter).toBe("custom filter");
    });

    it("should clear filter if not exists in QSP", () => {
      spectator.setRouteQueryParam("query", undefined);
      expect(component.filter).toBe("");
    });

    it("should set page number from QSP if exists", () => {
      spectator.setRouteQueryParam("page", "5");
      expect(component.page).toBe(5);
    });

    it("should set page number to 1 if not exists in QSP", () => {
      spectator.setRouteQueryParam("page", undefined);
      expect(component.page).toBe(1);
    });

    it("should create api request", () => {
      const spy = jasmine.createSpy();
      component.apiRequest$.next = spy;
      spectator.setRouteQueryParam("query", "custom filter");
      expect(spy).toHaveBeenCalled();
    });

    it("should create api request with new values", (done) => {
      let count = 0;
      const spy = jasmine
        .createSpy()
        .and.callFake((values: { page: number; filterText: string }) => {
          if (count === 0) {
            count++;
            expect(values.page).toBe(5);
          } else {
            expect(values.filterText).toBe("custom filter");
            done();
          }
        });
      component.apiRequest$.next = spy;
      spectator.setRouteQueryParam("page", "5");
      spectator.setRouteQueryParam("query", "custom filter");
    });
  });

  describe("updateQueryParams", () => {
    function assertQueryParams(params: Params) {
      expect(component["router"].navigate).toHaveBeenCalledWith([], {
        relativeTo: component["route"],
        queryParams: params,
      });
    }

    beforeEach(() => {
      setup();
      interceptFilter();
      spectator.detectChanges();
    });

    it("should not write page number to QSP on first page", () => {
      component["updateQueryParams"](1);
      assertQueryParams({});
    });

    it("should write page number to QSP when greater than first page", () => {
      component["updateQueryParams"](2);
      assertQueryParams({ [pageKey]: 2 });
    });

    it("should not write filter to QSP when undefined", () => {
      component["updateQueryParams"](1, undefined);
      assertQueryParams({});
    });

    it("should not write filter to QSP when empty string", () => {
      component["updateQueryParams"](1, "");
      assertQueryParams({});
    });

    it("should write filter to QSP when filter supplied", () => {
      component["updateQueryParams"](1, "custom filter");
      assertQueryParams({ [queryKey]: "custom filter" });
    });

    it("should write both page number and filter to QSP", () => {
      component["updateQueryParams"](5, "custom filter");
      assertQueryParams({ [pageKey]: 5, [queryKey]: "custom filter" });
    });
  });

  describe("onFilter", () => {
    beforeEach(() => {
      setup();
      interceptFilter();
      spectator.detectChanges();
      component.apiRequest$.next = jasmine.createSpy().and.stub();
    });

    it("should create api request with new filter value", () => {
      component.onFilter("custom filter");
      expect(component.apiRequest$.next).toHaveBeenCalledWith({
        page: 1,
        filterText: "custom filter",
      });
    });

    it("should reset existing page number to 1", () => {
      component["_page"] = 5;
      component.onFilter("custom filter");
      expect(component.apiRequest$.next).toHaveBeenCalledWith({
        page: 1,
        filterText: "custom filter",
      });
    });

    it("should create api request with custom page number", () => {
      component.onFilter("custom filter", 5);
      expect(component.apiRequest$.next).toHaveBeenCalledWith({
        page: 5,
        filterText: "custom filter",
      });
    });
  });

  describe("set page", () => {
    beforeEach(() => {
      setup();
      interceptFilter();
      spectator.detectChanges();
      component.apiRequest$.next = jasmine.createSpy().and.stub();
    });

    it("should create api request with new page number", () => {
      component.page = 5;
      expect(component.apiRequest$.next).toHaveBeenCalledWith({
        page: 5,
        filterText: "",
      });
    });

    it("should not reset existing filter text", () => {
      component.filter = "custom filter";
      component.page = 5;
      expect(component.apiRequest$.next).toHaveBeenCalledWith({
        page: 5,
        filterText: "custom filter",
      });
    });
  });
});
