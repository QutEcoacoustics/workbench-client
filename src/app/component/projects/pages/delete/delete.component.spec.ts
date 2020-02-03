import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { BehaviorSubject, Subject } from "rxjs";
import { formlyRoot, testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { projectsMenuItem } from "../../projects.menus";
import { DeleteComponent } from "./delete.component";

describe("ProjectsDeleteComponent", () => {
  let component: DeleteComponent;
  let api: ProjectsService;
  let router: Router;
  let route: ActivatedRoute;
  let fixture: ComponentFixture<DeleteComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 5 });
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [DeleteComponent],
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    api = TestBed.get(ProjectsService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display loading spinner", () => {
    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeTruthy();
  });

  it("should hide loading spinner on form load", fakeAsync(() => {
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeFalsy();
  }));

  it("should display form", fakeAsync(() => {
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector("form");
    expect(form).toBeTruthy();
  }));

  it("should getProject with route param id", fakeAsync(() => {
    const getProjectSpy = spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(getProjectSpy).toHaveBeenCalledWith(5);
  }));

  it("should handle unauthorized", fakeAsync(() => {
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "You need to log in or register before continuing."
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const errorHandler = fixture.nativeElement.querySelector(
      "app-error-handler"
    );
    expect(errorHandler).toBeTruthy();
    expect(errorHandler.querySelector("h1").innerText).toBe(
      "Unauthorized access"
    );
    expect(errorHandler.querySelector("p").innerText).toBe(
      "You need to log in or register before continuing."
    );
  }));

  it("should handle not found", fakeAsync(() => {
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.error({
          status: 404,
          message: "Project not found"
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const errorHandler = fixture.nativeElement.querySelector(
      "app-error-handler"
    );
    expect(errorHandler).toBeTruthy();
    expect(errorHandler.querySelector("h1").innerText).toBe("Not found");
    expect(errorHandler.querySelector("p").innerText).toBe("Project not found");
  }));

  it("should display form with project name in title", fakeAsync(() => {
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h2");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Custom Project");
  }));

  it("should display form with red delete button", fakeAsync(() => {
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button.btn-danger");
    expect(button).toBeTruthy();
    expect(button.innerText).toContain("Delete");
  }));

  it("should delete project on submit", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    const deleteSpy = spyOn(api, "deleteProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(deleteSpy).toHaveBeenCalledWith(5);
  }));

  it("should navigate on successful submit", fakeAsync(() => {
    const navigateSpy = spyOn(router, "navigate").and.stub();
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "deleteProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(projectsMenuItem.route.toRoute());
  }));

  it("should display form error on failure to submit", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "deleteProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "You need to log in or register before continuing."
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector("ngb-alert.alert-danger");
    expect(alert).toBeTruthy();
    expect(alert.innerText).toContain(
      "You need to log in or register before continuing."
    );
  }));

  it("should disable submit button while submitting", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "deleteProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();

    tick(100);
  }));

  it("should re-enable submit button after submission success", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "deleteProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
  }));

  it("should re-enable submit button after submission failure", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(api, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Custom Project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "deleteProject").and.callFake(() => {
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "You need to log in or register before continuing."
        } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
  }));
});
