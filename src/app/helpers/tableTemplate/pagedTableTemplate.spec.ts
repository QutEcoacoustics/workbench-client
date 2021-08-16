import { Component } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Id } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import {
  mockActivatedRoute,
  MockData,
  MockResolvers,
} from "@test/helpers/testbed";
import { BehaviorSubject, Subject } from "rxjs";
import { PagedTableTemplate } from "./pagedTableTemplate";

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
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let api: SpyObject<ProjectsService>;

  function configureTestingModule(
    resolvers: MockResolvers = {},
    data: MockData = {}
  ) {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [SharedModule, RouterTestingModule, MockBawApiModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(resolvers, data),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    api = TestBed.inject(ProjectsService) as SpyObject<ProjectsService>;
    component = fixture.componentInstance;
  }

  function generateMetaData(page: number = 1, total: number = 1) {
    return {
      status: 200,
      message: "OK",
      paging: { page, total },
    };
  }

  it("should create", () => {
    configureTestingModule();
    api.filter.and.callFake(() => new Subject());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error response", () => {
    configureTestingModule();
    const error = generateApiErrorDetails();
    api.filter.and.callFake(() => {
      const subject = new Subject<Project[]>();
      subject.error(error);
      return subject;
    });
    fixture.detectChanges();

    expect(component.error).toEqual(error);
  });

  describe("resolvers", () => {
    function setProject() {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
    }

    it("should handle resolver", () => {
      configureTestingModule(
        { model: "modelResolver" },
        { model: { model: new MockModel({ id: 1 }) } }
      );
      setProject();

      fixture.detectChanges();
      expect(component.failure).toBeFalsy();
      expect(component.models.model).toEqual(new MockModel({ id: 1 }));
    });

    it("should handle multiple resolvers", () => {
      configureTestingModule(
        { model1: "model1Resolver", model2: "model2Resolver" },
        {
          model1: { model: new MockModel({ id: 1 }) },
          model2: { model: new MockModel({ id: 2 }) },
        }
      );
      setProject();

      fixture.detectChanges();
      expect(component.failure).toBeFalsy();
      expect(component.models.model1).toEqual(new MockModel({ id: 1 }));
      expect(component.models.model2).toEqual(new MockModel({ id: 2 }));
    });

    it("should handle resolver error", () => {
      configureTestingModule(
        { model: "modelResolver" },
        { model: { error: generateApiErrorDetails() } }
      );
      setProject();

      fixture.detectChanges();
      expect(component.failure).toBeTrue();
    });

    it("should handle any resolver error", () => {
      configureTestingModule(
        { model1: "model1Resolver", model2: "model2Resolver" },
        {
          model1: { model: new MockModel({ id: 1 }) },
          model2: { error: generateApiErrorDetails() },
        }
      );
      setProject();

      fixture.detectChanges();
      expect(component.failure).toBeTrue();
    });
  });

  describe("rows", () => {
    function setProjects(projects: Project[]) {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>(projects));
    }

    beforeEach(() => {
      configureTestingModule();
    });

    it("should handle zero model response", () => {
      setProjects([]);
      fixture.detectChanges();
      expect(component.rows).toEqual([]);
    });

    it("should handle single model response", () => {
      const project = new Project(generateProject());
      project.addMetadata(generateMetaData());
      setProjects([project]);
      fixture.detectChanges();

      expect(component.rows).toEqual([{ id: project.id, name: project.name }]);
    });

    it("should handle multiple model total", () => {
      const project1 = new Project(generateProject());
      const project2 = new Project(generateProject());
      [project1, project2].forEach((project) =>
        project.addMetadata(generateMetaData(1, 25))
      );

      setProjects([project1, project2]);
      fixture.detectChanges();

      expect(component.rows).toEqual([
        { id: project1.id, name: project1.name },
        { id: project2.id, name: project2.name },
      ]);
    });
  });

  describe("setPage", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should handle zero models", () => {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
      component.setPage({
        offset: 0,
        count: 1,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(0);
    });

    it("should handle 0 offset", () => {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
      component.setPage({
        offset: 0,
        count: 1,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      fixture.detectChanges();

      expect(api.filter).toHaveBeenCalledWith({ paging: { page: 1 } });
    });

    it("should handle 1 offset", () => {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
      component.setPage({
        offset: 1,
        count: 26,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      fixture.detectChanges();

      expect(api.filter).toHaveBeenCalledWith({ paging: { page: 2 } });
    });
  });

  describe("pageNumber", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should handle zero models", () => {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
      fixture.detectChanges();
      expect(component.pageNumber).toBe(0);
    });

    it("should handle first page", () => {
      const project = new Project(generateProject());
      project.addMetadata(generateMetaData(1, 25));
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([project]));
      component.setPage({
        offset: 0,
        count: 1,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(0);
    });

    it("should handle random page", () => {
      const project = new Project(generateProject());
      project.addMetadata(generateMetaData(3, 25));
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([project]));
      component.setPage({
        offset: 2,
        count: 51,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(2);
    });

    it("should update before api response", () => {
      const project = new Project(generateProject());
      project.addMetadata(generateMetaData(3, 25));
      api.filter.and.callFake(() => new Subject<Project[]>());
      component.setPage({
        offset: 2,
        count: 51,
        limit: 25,
        pageSize: defaultApiPageSize,
      });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(2);
    });
  });

  describe("onFilter", () => {
    beforeEach(() => {
      configureTestingModule();
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
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
      fixture.detectChanges();
    }

    it("should handle empty filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "", mockInput);

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({ filter: undefined });
    }));

    it("should handle random filterKey", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("custom", "a", mockInput);

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["custom" as any]: { contains: "a" } },
      });
    }));

    it("should handle single character filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "a", mockInput);

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["testing" as any]: { contains: "a" } },
      });
    }));

    it("should handle multi character filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "testing", mockInput);

      tick(1000);
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

      tick(1000);
      expect(api.filter).toHaveBeenCalledTimes(2); // Initial filter request on ngOnInit
    }));

    it("should call last filter value", fakeAsync(() => {
      const input = "testing";
      const mockInput = createInput();

      for (let i = 0; i < input.length; i++) {
        const subSet = input.substring(0, i + 1);
        createFilterEvent("testing", subSet, mockInput);
      }

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { ["testing" as any]: { contains: "testing" } },
      });
    }));
  });

  describe("onSort", () => {
    beforeEach(() => {
      configureTestingModule();
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
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
      fixture.detectChanges();

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({ sorting: undefined });
    }));

    it("should handle asc sorting", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "asc", "testing");
      fixture.detectChanges();

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "asc" },
      });
    }));

    it("should handle desc sorting", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "desc", "testing");
      fixture.detectChanges();

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "desc" },
      });
    }));

    it("should handle single sortKey", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "asc", "testing");
      fixture.detectChanges();

      tick(1000);
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
      fixture.detectChanges();

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "asc" },
      });
    }));
  });

  describe("totalModels", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should handle zero models", () => {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
      fixture.detectChanges();
      expect(component.totalModels).toBe(0);
    });

    it("should handle single model", () => {
      const project = new Project(generateProject());
      project.addMetadata(generateMetaData(1, 1));

      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([project]));
      fixture.detectChanges();

      expect(component.totalModels).toBe(1);
    });

    it("should handle multiple models", () => {
      const project = new Project(generateProject());
      project.addMetadata(generateMetaData(1, 100));

      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([project]));
      fixture.detectChanges();

      expect(component.totalModels).toBe(100);
    });
  });

  describe("loadingData", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should be false initially", () => {
      expect(component.loadingData).toBeFalsy();
    });

    it("should be true while awaiting api response", () => {
      api.filter.and.callFake(() => new Subject<Project[]>());
      fixture.detectChanges();

      expect(component.loadingData).toBeTrue();
    });

    it("should be false after success api response", () => {
      api.filter.and.callFake(() => new BehaviorSubject<Project[]>([]));
      fixture.detectChanges();

      expect(component.loadingData).toBeFalse();
    });

    it("should be false after error api response", () => {
      api.filter.and.callFake(() => {
        const subject = new Subject<Project[]>();
        subject.error(generateApiErrorDetails());
        return subject;
      });
      fixture.detectChanges();

      expect(component.loadingData).toBeFalse();
    });
  });
});
