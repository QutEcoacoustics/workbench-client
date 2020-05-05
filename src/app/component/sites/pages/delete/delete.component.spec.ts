import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { assertResolverErrorHandling } from "src/app/test/helpers/html";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
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
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              site: siteResolvers.show,
            },
            {
              project: {
                model: project,
                error: projectError,
              },
              site: {
                model: site,
                error: siteError,
              },
            }
          ),
        },
      ],
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
      name: "Project",
    });
    defaultSite = new Site({
      id: 1,
      name: "Site",
    });
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(undefined, defaultError, defaultSite, undefined);
      assertResolverErrorHandling(fixture);
    });

    it("should handle site error", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        undefined,
        defaultError
      );
      assertResolverErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "destroy").and.callThrough();
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to projects", () => {
      const spy = spyOnProperty(defaultProject, "viewUrl");
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "destroy").and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
