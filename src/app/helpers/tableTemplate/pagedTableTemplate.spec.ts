import { Component } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { ApiErrorDetails } from "@services/baw-api/api.interceptor.service";
import { SharedModule } from "@shared/shared.module";
import { BehaviorSubject, Subject } from "rxjs";
import {
  mockActivatedRoute,
  MockData,
  MockResolvers,
} from "src/app/test/helpers/testbed";
import { PagedTableTemplate } from "./pagedTableTemplate";

class MockModel extends AbstractModel {
  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
}

@Component({
  selector: "app-test-component",
  template: `
    <ngx-datatable #table [rows]="rows" [columns]="columns"> </ngx-datatable>
  `,
})
class MockComponent extends PagedTableTemplate<
  { id: Id; name: string },
  Project
> {
  public columns = [{ prop: "id" }];

  constructor(api: ProjectsService, route: ActivatedRoute) {
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
  let api: ProjectsService;

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
          useClass: mockActivatedRoute(resolvers, data),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    api = TestBed.inject(ProjectsService);
    component = fixture.componentInstance;
  }

  it("should create", () => {
    configureTestingModule();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error response", () => {
    configureTestingModule();
    const error = { status: 401, message: "Unauthorized" } as ApiErrorDetails;
    spyOn(api, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();
      subject.error(error);
      return subject;
    });
    fixture.detectChanges();

    expect(component.error).toEqual(error);
  });

  describe("resolvers", () => {
    function setProject() {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
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
        { model: { error: { status: 401, message: "Unauthorized" } } }
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
          model2: { error: { status: 401, message: "Unauthorized" } },
        }
      );
      setProject();

      fixture.detectChanges();
      expect(component.failure).toBeTrue();
    });
  });

  describe("rows", () => {
    function setProjects(projects: Project[]) {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>(projects);
      });
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
      const project = new Project({
        id: 1,
        name: "Project",
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 1,
        },
      });
      setProjects([project]);
      fixture.detectChanges();

      expect(component.rows).toEqual([{ id: 1, name: "Project" }]);
    });

    it("should handle multiple model total", () => {
      const project1 = new Project({
        id: 1,
        name: "Project 1",
      });
      const project2 = new Project({
        id: 2,
        name: "Project 2",
      });
      [project1, project2].forEach((project) =>
        project.addMetadata({
          status: 200,
          message: "OK",
          paging: {
            page: 1,
            total: 25,
          },
        })
      );

      setProjects([project1, project2]);
      fixture.detectChanges();

      expect(component.rows).toEqual([
        { id: 1, name: "Project 1" },
        { id: 2, name: "Project 2" },
      ]);
    });
  });

  describe("setPage", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should handle zero models", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.setPage({ offset: 0, count: 1, limit: 25, pageSize: 25 });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(0);
    });

    it("should handle 0 offset", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.setPage({ offset: 0, count: 1, limit: 25, pageSize: 25 });
      fixture.detectChanges();

      expect(api.filter).toHaveBeenCalledWith({ paging: { page: 1 } });
    });

    it("should handle 1 offset", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.setPage({ offset: 1, count: 26, limit: 25, pageSize: 25 });
      fixture.detectChanges();

      expect(api.filter).toHaveBeenCalledWith({ paging: { page: 2 } });
    });
  });

  describe("pageNumber", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should handle zero models", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(0);
    });

    it("should handle first page", () => {
      const project = new Project({
        id: 1,
        name: "Project",
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 25,
        },
      });
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      component.setPage({ offset: 0, count: 1, limit: 25, pageSize: 25 });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(0);
    });

    it("should handle random page", () => {
      const project = new Project({
        id: 1,
        name: "Project",
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 3,
          total: 25,
        },
      });
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      component.setPage({ offset: 2, count: 51, limit: 25, pageSize: 25 });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(2);
    });

    it("should update before api response", () => {
      const project = new Project({
        id: 1,
        name: "Project",
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 3,
          total: 25,
        },
      });
      spyOn(api, "filter").and.callFake(() => {
        return new Subject<Project[]>();
      });
      component.setPage({ offset: 2, count: 51, limit: 25, pageSize: 25 });
      fixture.detectChanges();

      expect(component.pageNumber).toBe(2);
    });
  });

  describe("onFilter", () => {
    beforeEach(() => {
      configureTestingModule();
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
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

      component.onFilter({ target: mockInput } as any);
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
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
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
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      fixture.detectChanges();

      expect(component.totalModels).toBe(0);
    });

    it("should handle single model", () => {
      const project = new Project({
        id: 1,
        name: "Project",
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 1,
        },
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      fixture.detectChanges();

      expect(component.totalModels).toBe(1);
    });

    it("should handle multiple models", () => {
      const project = new Project({
        id: 1,
        name: "Project",
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 100,
        },
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
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
      spyOn(api, "filter").and.callFake(() => {
        return new Subject<Project[]>();
      });
      fixture.detectChanges();

      expect(component.loadingData).toBeTrue();
    });

    it("should be false after success api response", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      fixture.detectChanges();

      expect(component.loadingData).toBeFalse();
    });

    it("should be false after error api response", () => {
      spyOn(api, "filter").and.callFake(() => {
        const subject = new Subject<Project[]>();
        subject.error({
          status: 401,
          message: "Unauthorized",
        } as ApiErrorDetails);
        return subject;
      });
      fixture.detectChanges();

      expect(component.loadingData).toBeFalse();
    });
  });
});
