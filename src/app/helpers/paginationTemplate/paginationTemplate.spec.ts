import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { IProject, Project } from "@models/Project";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { nStepObservable } from "@test/helpers/general";
import { Subject } from "rxjs";
import { PaginationTemplate } from "./paginationTemplate";

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
  const createComponent = createRoutingFactory({
    component: MockComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function setup() {
    spectator = createComponent({ detectChanges: false });
    api = spectator.inject(ProjectsService);
  }

  function interceptFilter(
    models: Project[] = [],
    expectations?: (filters: Filters, ...args: any[]) => void
  ) {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(subject, () => models);
    api.filter.andCallFake((filters: Filters, ...args: any[]) => {
      expectations?.(filters, args);
      return subject;
    });
    return promise;
  }

  function generateFilter(page: number = 1, filter?: Filters) {
    return { paging: { page }, filter };
  }

  describe("api", () => {
    it("should create filter request on load", async () => {
      setup();
      const promise = interceptFilter([], (filters) =>
        expect(filters).toBeTruthy()
      );
      spectator.detectChanges();
      await promise;
    });

    it("should request first page on load", async () => {
      setup();
      const promise = interceptFilter([], (filters) =>
        expect(filters).toEqual(generateFilter(1))
      );
      spectator.detectChanges();
      await promise;
    });
  });

  describe("getModels", () => {
    it("should create api filter request", () => {});
    it("should create api filter request with additional parameters", () => {});
    it("should create api filter request with random page number", () => {});
    it("should create api filter request with undefined filter", () => {});
    it("should create api filter request with filter", () => {});
    it("should create api filter request with defaultFilter parameters", () => {});
    it("should override page number in defaultFilter parameters", () => {});
    it("should override model filter in defaultFilter parameters", () => {});
    it("should set load to false on response", () => {});
    it("should set collectionSize to 0 if models do not exist", () => {});
    it("should set collectionSize to model paging total if models exist", () => {});
    it("should call apiUpdate with the response models", () => {});
  });

  describe("updateMatrixParams", () => {
    it("should navigate to current page", () => {});
    it("should not write page number to QSP on first page", () => {});
    it("should write page number to QSP when greater than first page", () => {});
    it("should not write filter to QSP when none given", () => {});
    it("should write filter to QSP when filter supplied", () => {});
    it("should write both page number and filter to QSP", () => {});
  });

  describe("onFilter", () => {
    it("should reset page number to 1", () => {});
    it("should accept custom page number", () => {});
    it("should set filter to value of user input", () => {});
    it("should set loading to true", () => {});
    it("should create api request with new filter value", () => {});
    it("should update QSP values", () => {});
  });

  describe("set page", () => {
    it("should set page number", () => {});
    it("should not reset filter", () => {});
    it("should set loading to true", () => {});
    it("should create api request with new page number", () => {});
    it("should update QSP values", () => {});
  });

  describe("updateFromUrl", () => {
    it("should set filter from QSP if exists", () => {});
    it("should not set filter from QSP if not exists", () => {});
    it("should set page number from QSP if exists", () => {});
    it("should set page number to 1 if not exists in QSP", () => {});
    it("should create api request", () => {});
  });

  describe("onInit", () => {
    it("should set pagination defaults", () => {});
    it("should set page number to 1", () => {});
    it("should retrieve page number and filter from QSP", () => {});
  });

  describe("apiRequest$", () => {
    it("should be defined", () => {});
    it("should call getModels", () => {});
    it("should handle error", () => {});
  });
});
