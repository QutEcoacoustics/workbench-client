import { Component, ViewChild } from "@angular/core";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { BehaviorSubject, Subject } from "rxjs";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Id } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { testBawServices } from "src/app/test.helper";
import { PagedTableTemplate } from "./pagedTableTemplate";

@Component({
  selector: "app-test-component",
  template: `
    <ngx-datatable #table [rows]="rows" [columns]="columns"> </ngx-datatable>
  `
})
class MockComponent extends PagedTableTemplate<
  { id: Id; name: string },
  Project
> {
  // TODO Check if this bug has been fixed
  // Unsure why but this line is required in unit tests
  // Specifically: a unit test which is run with another .spec.ts file
  // in the pool of tests. If this test suite is run in isolation it
  // will pass without this line.
  @ViewChild(DatatableComponent) table: DatatableComponent;

  public columns = [{ prop: "id" }];

  constructor(api: ProjectsService) {
    super(api, models =>
      models.map(model => ({ id: model.id, name: model.name }))
    );
  }
}

describe("PagedTableTemplate", () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let api: ProjectsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [SharedModule],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    api = TestBed.inject(ProjectsService);
    component = fixture.componentInstance;
  }));

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error response", () => {
    const error = { status: 401, message: "Unauthorized" } as ApiErrorDetails;
    spyOn(api, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();
      subject.error(error);
      return subject;
    });
    component.getModels();
    fixture.detectChanges();

    expect(component.error).toEqual(error);
  });

  describe("rows", () => {
    it("should handle zero model response", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.rows).toEqual([]);
    });

    it("should handle single model response", () => {
      const project = new Project({
        id: 1,
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 1
        }
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.rows).toEqual([{ id: 1, name: "Project" }]);
    });

    it("should handle multi model response", () => {
      const project = new Project({
        id: 1,
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 25
        }
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.rows).toEqual([{ id: 1, name: "Project" }]);
    });
  });

  describe("setPage", () => {
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
    it("should handle zero models", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.pageNumber).toBe(0);
    });

    it("should handle first page", () => {
      const project = new Project({
        id: 1,
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 25
        }
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
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 3,
          total: 25
        }
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
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 3,
          total: 25
        }
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
      component.filterKey = filterKey;
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
        filter: { custom: { contains: "a" } }
      });
    }));

    it("should handle single character filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "a", mockInput);

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { testing: { contains: "a" } }
      });
    }));

    it("should handle multi character filter", fakeAsync(() => {
      const mockInput = createInput();
      createFilterEvent("testing", "testing", mockInput);

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { testing: { contains: "testing" } }
      });
    }));

    it("should debounce filters", fakeAsync(() => {
      const input = "testing";
      const mockInput = createInput();
      createFilterEvent("testing", "", mockInput);

      for (let i = 0; i < input.length; i++) {
        const subSet = input.substring(0, i);
        createFilterEvent("testing", subSet, mockInput);
      }

      tick(1000);
      expect(api.filter).toHaveBeenCalledTimes(1);
    }));

    it("should call last filter value", fakeAsync(() => {
      const input = "testing";
      const mockInput = createInput();
      createFilterEvent("testing", "", mockInput);

      for (let i = 0; i < input.length; i++) {
        const subSet = input.substring(0, i + 1);
        createFilterEvent("testing", subSet, mockInput);
      }

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        filter: { testing: { contains: "testing" } }
      });
    }));
  });

  describe("onSort", () => {
    beforeEach(() => {
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
          name: "Do Not Read"
        }
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
        sorting: { orderBy: "customKey", direction: "asc" }
      });
    }));

    it("should handle desc sorting", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "desc", "testing");
      fixture.detectChanges();

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "desc" }
      });
    }));

    it("should handle single sortKey", fakeAsync(() => {
      createSortEvent({ testing: "customKey" }, "asc", "testing");
      fixture.detectChanges();

      tick(1000);
      expect(api.filter).toHaveBeenCalledWith({
        sorting: { orderBy: "customKey", direction: "asc" }
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
        sorting: { orderBy: "customKey", direction: "asc" }
      });
    }));
  });

  describe("totalModels", () => {
    it("should handle zero models", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.totalModels).toBe(0);
    });

    it("should handle single model", () => {
      const project = new Project({
        id: 1,
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 1
        }
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.totalModels).toBe(1);
    });

    it("should handle multiple models", () => {
      const project = new Project({
        id: 1,
        name: "Project"
      });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          total: 100
        }
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.totalModels).toBe(100);
    });
  });

  describe("loadingData", () => {
    it("should be false initially", () => {
      expect(component.loadingData).toBeFalsy();
    });

    it("should be true while awaiting api response", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new Subject<Project[]>();
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.loadingData).toBeTrue();
    });

    it("should be false after success api response", () => {
      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.loadingData).toBeFalse();
    });

    it("should be false after error api response", () => {
      spyOn(api, "filter").and.callFake(() => {
        const subject = new Subject<Project[]>();
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as ApiErrorDetails);
        return subject;
      });
      component.getModels();
      fixture.detectChanges();

      expect(component.loadingData).toBeFalse();
    });
  });
});
