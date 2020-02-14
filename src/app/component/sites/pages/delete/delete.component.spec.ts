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
import { formlyRoot } from "src/app/app.helper";
import { projectMenuItem } from "src/app/component/projects/projects.menus";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { testBawServices } from "src/app/test.helper";
import { DeleteComponent } from "./delete.component";

describe("SitesDeleteComponent", () => {
  let component: DeleteComponent;
  let api: SitesService;
  let router: Router;
  let route: ActivatedRoute;
  let fixture: ComponentFixture<DeleteComponent>;

  class MockActivatedRoute {
    public params = new BehaviorSubject<any>({ projectId: 5, siteId: 10 });
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
    api = TestBed.get(SitesService);
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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
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

  it("should show with route param id", fakeAsync(() => {
    const showSpy = spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(showSpy).toHaveBeenCalledWith(5, 10);
  }));

  it("should handle unauthorized", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Custom Site",
            creatorId: 1,
            projectIds: new Set([])
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
    expect(title.innerText).toContain("Custom Site");
  }));

  it("should display form with red delete button", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    const deleteSpy = spyOn(api, "destroy").and.callFake(() => {
      const subject = new Subject<null>();

      setTimeout(() => {
        subject.next();
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

    expect(deleteSpy).toHaveBeenCalledWith(5, 10);
  }));

  it("should navigate on successful submit", fakeAsync(() => {
    const navigateSpy = spyOn(router, "navigate").and.stub();
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "destroy").and.callFake(() => {
      const subject = new Subject<null>();

      setTimeout(() => {
        subject.next();
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
    expect(navigateSpy).toHaveBeenCalledWith([
      projectMenuItem.route.format({ projectId: 5 })
    ]);
  }));

  it("should display form error on failure to submit", fakeAsync(() => {
    spyOn(router, "navigate").and.stub();
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "destroy").and.callFake(() => {
      const subject = new Subject<null>();

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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "destroy").and.callFake(() => {
      const subject = new Subject<null>();

      setTimeout(() => {
        subject.next();
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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "destroy").and.callFake(() => {
      const subject = new Subject<null>();

      setTimeout(() => {
        subject.next();
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
    spyOn(api, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    spyOn(api, "destroy").and.callFake(() => {
      const subject = new Subject<null>();

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
