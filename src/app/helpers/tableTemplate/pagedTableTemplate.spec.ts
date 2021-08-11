import { Component } from "@angular/core";
import { fakeAsync, tick } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import {
  ApiErrorDetails,
  isApiErrorDetails,
} from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Errorable } from "@helpers/advancedTypes";
import { Id } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute, MockData } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";
import { PagedTableTemplate, TablePage } from "./pagedTableTemplate";

@Component({
  selector: "baw-test-component",
  template: `
    <ngx-datatable #table [rows]="rows" [columns]="columns"> </ngx-datatable>
  `,
})
class MockComponent extends PagedTableTemplate<
  { id: Id; name: string },
  Project
> {
  public columns = [{ prop: "id" }];

  public constructor(api: ProjectsService, route: ActivatedRoute) {
    super(
      api,
      (models) => models.map((model) => ({ id: model.id, name: model.name })),
      route
    );
  }
}

describe("PagedTableTemplate", () => {
  let defaultProject: Project;
  let defaultError: ApiErrorDetails;
  let api: SpyObject<ProjectsService>;
  let component: MockComponent;
  let spec: Spectator<MockComponent>;
  const createComponent = createComponentFactory({
    component: MockComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  function setup(resolvers: string[] = [], data: MockData = {}) {
    spec = createComponent({
      detectChanges: false,
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            resolvers.reduce((obj, resolver) => {
              obj[resolver] = "resolver";
              return obj;
            }, {}),
            data
          ),
        },
      ],
    });
    api = spec.inject(ProjectsService);

    component = spec.component;
    defaultProject = new Project(generateProject());
    defaultError = generateApiErrorDetails();
  }

  async function setProjects(projects: Errorable<Project[]>): Promise<any> {
    const subject = new Subject<Project[]>();
    const isError = isApiErrorDetails(projects);
    api.filter.and.callFake(() => subject);
    const promise = nStepObservable(subject, () => projects, isError);

    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function setPage(pageInfo: TablePage) {
    component.setPage(pageInfo);
  }

  function generateMetaData(page: number = 1, total: number = 1) {
    return {
      status: 200,
      message: "OK",
      paging: { page, total },
    };
  }

  it("should create", async () => {
    setup();
    await setProjects([]);
    expect(component).toBeTruthy();
  });

  it("should handle error response", async () => {
    setup();
    await setProjects(defaultError);
    expect(component.error).toEqual(defaultError);
  });

  describe("resolvers", () => {
    function assertFailure(hasFailed: boolean) {
      if (hasFailed) {
        expect(component.failure).toBeTruthy();
      } else {
        expect(component.failure).toBeFalsy();
      }
    }

    function assertModels(
      models: { modelName: string; expectation: MockModel }[]
    ) {
      models.forEach(({ modelName, expectation }) => {
        expect(component.models[modelName]).toEqual(expectation);
      });
    }

    it("should handle resolver", async () => {
      const model = new MockModel({ id: 1 });
      setup(["model"], { model: { model } });
      await setProjects([]);

      assertFailure(false);
      assertModels([{ modelName: "model", expectation: model }]);
    });

    it("should handle multiple resolvers", async () => {
      const models = [new MockModel({ id: 1 }), new MockModel({ id: 2 })];
      setup(["model1", "model2"], {
        model1: { model: models[0] },
        model2: { model: models[1] },
      });
      await setProjects([]);

      assertFailure(false);
      assertModels([
        { modelName: "model1", expectation: models[0] },
        { modelName: "model2", expectation: models[1] },
      ]);
    });

    it("should handle resolver error", async () => {
      setup(["model"], { model: { error: generateApiErrorDetails() } });
      await setProjects([]);
      assertFailure(true);
    });

    it("should handle any resolver error", async () => {
      setup(["model1", "model2"], {
        model1: { model: new MockModel({ id: 1 }) },
        model2: { error: generateApiErrorDetails() },
      });
      await setProjects([]);
      assertFailure(true);
    });
  });

  describe("rows", () => {
    function assertRows(rows: { id: number; name: string }[]) {
      expect(component.rows).toEqual(rows);
    }

    beforeEach(() => setup());

    it("should handle zero model response", async () => {
      await setProjects([]);
      assertRows([]);
    });

    it("should handle single model response", async () => {
      defaultProject.addMetadata(generateMetaData());
      await setProjects([defaultProject]);
      assertRows([{ id: defaultProject.id, name: defaultProject.name }]);
    });

    it("should handle multiple model total", async () => {
      const projects = [
        new Project(generateProject()),
        new Project(generateProject()),
      ];
      projects.forEach((project) =>
        project.addMetadata(generateMetaData(1, 25))
      );

      await setProjects(projects);
      assertRows(projects.map(({ id, name }) => ({ id, name })));
    });
  });

  describe("setPage", () => {
    beforeEach(() => setup());

    it("should handle zero models", async () => {
      await setProjects([]);
      setPage({
        offset: 0,
        count: 1,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      expect(component.pageNumber).toBe(0);
    });

    it("should handle 0 offset", async () => {
      await setProjects([]);
      setPage({
        offset: 0,
        count: 1,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      expect(api.filter).toHaveBeenCalledWith({ paging: { page: 1 } });
    });

    it("should handle 1 offset", async () => {
      await setProjects([]);
      setPage({
        offset: 1,
        count: 26,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      expect(api.filter).toHaveBeenCalledWith({ paging: { page: 2 } });
    });
  });

  describe("pageNumber", () => {
    function assertPageNumber(pageNum: number) {
      expect(component.pageNumber).toBe(pageNum);
    }

    beforeEach(() => setup());

    it("should handle zero models", async () => {
      await setProjects([]);
      assertPageNumber(0);
    });

    it("should handle first page", async () => {
      defaultProject.addMetadata(generateMetaData(1, 25));
      await setProjects([defaultProject]);
      setPage({
        offset: 0,
        count: 1,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      assertPageNumber(0);
    });

    it("should handle random page", async () => {
      defaultProject.addMetadata(generateMetaData(3, 25));
      await setProjects([defaultProject]);
      setPage({
        offset: 2,
        count: 51,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      assertPageNumber(2);
    });

    it("should update before api response", async () => {
      await setProjects([]);
      setPage({
        offset: 2,
        count: 51,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      assertPageNumber(2);
    });
  });

  describe("onFilter", () => {
    beforeEach(async () => {
      setup();
      await setProjects([]);
    });

    function createInput() {
      return document.createElement("input");
    }

    function createFilterEvent(
      filterKey: string,
      value: string,
      mockInput: HTMLInputElement
    ) {
      component.filterKey = filterKey as any;
      mockInput.value = value;
      component.onFilter(value);
      spec.detectChanges();
    }

    it("should handle empty filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "", mockInput);

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({ filter: undefined });
    }));

    it("should handle random filterKey", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("custom", "a", mockInput);

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["custom" as any]: { contains: "a" } },
      });
    }));

    it("should handle single character filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "a", mockInput);

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["testing" as any]: { contains: "a" } },
      });
    }));

    it("should handle multi character filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "testing", mockInput);

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["testing" as any]: { contains: "testing" } },
      });
    }));

    it("should debounce filters", fakeAsync(() => {
      const input = "testing";
      const mockInput = createInput();

      for (let i = 0; i < input.length; i++) {
        const subSet = input.substring(0, i);
        createFilterEvent("testing", subSet, mockInput);
      }

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledTimes(2); // Initial filter request on ngOnInit
    }));

    it("should call last filter value", fakeAsync(() => {
      const input = "testing";
      const mockInput = createInput();

      for (let i = 0; i < input.length; i++) {
        const subSet = input.substring(0, i + 1);
        createFilterEvent("testing", subSet, mockInput);
      }

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["testing" as any]: { contains: "testing" } },
      });
    }));
  });

  describe("onSort", () => {
    beforeEach(async () => {
      setup();
      await setProjects([]);
    });

    function createSortEvent(
      sortKeys: { [key: string]: string },
      value: "asc" | "desc",
      prop: string
    ) {
      component.sortKeys = sortKeys;
      component.onSort({
        newValue: value,
        prevValue: undefined,
        column: {
          sortable: true,
          prop,
          name: "Do Not Read",
        },
      });
    }

    it("should handle no sorting", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, undefined, "testing");
      spec.detectChanges();

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({ sorting: undefined });
    }));

    it("should handle asc sorting", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "asc", "testing");
      spec.detectChanges();

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "asc" },
      });
    }));

    it("should handle desc sorting", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "desc", "testing");
      spec.detectChanges();

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "desc" },
      });
    }));

    it("should handle single sortKey", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "asc", "testing");
      spec.detectChanges();

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "asc" },
      });
    }));

    it("should handle multiple sortKeys", fakeAsync(() => {
      createSortEvent(
        { testing: "customKey", testing2: "extraCustomKey" },
        "asc",
        "testing"
      );
      spec.detectChanges();

      tick(defaultDebounceTime);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "asc" },
      });
    }));
  });

  describe("totalModels", () => {
    function assertTotalModels(numModels: number) {
      expect(component.totalModels).toBe(numModels);
    }

    beforeEach(() => setup());

    it("should handle zero models", async () => {
      await setProjects([]);
      assertTotalModels(0);
    });

    it("should handle single model", async () => {
      defaultProject.addMetadata(generateMetaData(1, 1));
      await setProjects([defaultProject]);
      assertTotalModels(1);
    });

    it("should handle multiple models", async () => {
      defaultProject.addMetadata(generateMetaData(1, 100));
      await setProjects([defaultProject]);
      assertTotalModels(100);
    });
  });

  describe("loadingData", () => {
    beforeEach(() => setup());

    function assertLoadingData(isLoading: boolean) {
      if (isLoading) {
        expect(component.loadingData).toBeTruthy();
      } else {
        expect(component.loadingData).toBeFalsy();
      }
    }

    it("should be false initially", () => {
      assertLoadingData(false);
    });

    it("should be true while awaiting api response", () => {
      setProjects([]);
      assertLoadingData(true);
    });

    it("should be false after success api response", async () => {
      await setProjects([]);
      assertLoadingData(false);
    });

    it("should be false after error api response", async () => {
      await setProjects(defaultError);
      assertLoadingData(false);
    });
  });
});
