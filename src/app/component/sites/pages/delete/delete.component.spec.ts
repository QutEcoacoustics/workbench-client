import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { submitForm } from "src/testHelpers";
import { DeleteComponent } from "./delete.component";

describe("SitesDeleteComponent", () => {
  let api: SitesService;
  let component: DeleteComponent;
  let defaultError: ApiErrorDetails;
  let defaultSite: Site;
  let defaultProject: Project;
  let fixture: ComponentFixture<DeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    site: Site,
    siteError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [DeleteComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute({
            project: {
              model: project,
              error: projectError
            },
            site: {
              model: site,
              error: siteError
            }
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(SitesService);
    notifications = TestBed.inject(ToastrService);

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project({
      id: 1,
      name: "Project"
    });
    defaultSite = new Site({
      id: 1,
      name: "Site"
    });
    defaultError = {
      status: 401,
      message: "Unauthorized"
    };
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined, defaultSite, undefined);
    expect(component).toBeTruthy();
  });

  it("should handle project error", fakeAsync(() => {
    configureTestingModule(undefined, defaultError, defaultSite, undefined);

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  }));

  it("should handle site error", fakeAsync(() => {
    configureTestingModule(defaultProject, undefined, undefined, defaultError);

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  }));

  describe("form", () => {
    it("should eventually load form", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should display form with site name in title", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Custom Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);

      const title = fixture.nativeElement.querySelector("h2");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Custom Site");
    }));

    it("should display form with red delete button", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);

      const button = fixture.nativeElement.querySelector("button.btn-danger");
      expect(button).toBeTruthy();
      expect(button.innerText).toContain("Delete");
    }));
  });

  describe("failed submissions", () => {
    it("should display form error on failure to submit", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Custom Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        const subject = new Subject<void>();

        subject.error({
          status: 401,
          message: "You need to log in or register before continuing."
        } as ApiErrorDetails);

        return subject;
      });

      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "You need to log in or register before continuing."
      );
    }));

    it("should re-enable submit button after failed submission", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        const subject = new Subject<Site>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401
        } as ApiErrorDetails);

        return subject;
      });

      submitForm(fixture);

      flush();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );
      expect(button).toBeTruthy();
      expect(button.disabled).toBeFalsy("Button should not be disabled");
    }));
  });

  describe("successful submissions", () => {
    it("should delete site on submit", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Custom Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      const deleteSpy = spyOn(api, "destroy").and.callFake(() => {
        return new BehaviorSubject<null>(null);
      });

      submitForm(fixture);
      expect(deleteSpy).toHaveBeenCalledWith(site, defaultProject);
    }));

    it("should delete site on submit with random ids", fakeAsync(() => {
      const project = new Project({
        id: 5,
        name: "Custom Project"
      });
      const site = new Site({
        id: 10,
        name: "Custom Site"
      });
      configureTestingModule(project, undefined, site, undefined);
      const deleteSpy = spyOn(api, "destroy").and.callFake(() => {
        return new BehaviorSubject<null>(null);
      });

      submitForm(fixture);
      expect(deleteSpy).toHaveBeenCalledWith(site, project);
    }));

    it("should navigate on successful submit", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Custom Site"
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        return new BehaviorSubject<null>(null);
      });

      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        defaultProject.redirectPath()
      );
    }));

    it("should navigate on successful submit with random ids", fakeAsync(() => {
      const project = new Project({
        id: 5,
        name: "Custom Project"
      });
      const site = new Site({
        id: 10,
        name: "Custom Site"
      });
      configureTestingModule(project, undefined, site, undefined);
      spyOn(api, "destroy").and.callFake(() => {
        return new BehaviorSubject<null>(null);
      });

      submitForm(fixture);

      expect(router.navigateByUrl).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(project.redirectPath());
    }));

    it("should disable submit button while submitting", fakeAsync(() => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "destroy").and.stub();

      submitForm(fixture);

      const button = fixture.nativeElement.querySelector(
        "button[type='submit']"
      );
      expect(button.disabled).toBeTruthy();
    }));
  });
});
