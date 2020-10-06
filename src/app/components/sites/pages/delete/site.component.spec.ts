import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import { SharedModule } from "@components/shared/shared.module";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { SpyObject } from "@ngneat/spectator";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SiteDeleteComponent } from "./site.component";

describe("SiteDeleteComponent", () => {
  let api: SpyObject<SitesService>;
  let component: SiteDeleteComponent;
  let defaultSite: Site;
  let defaultProject: Project;
  let fixture: ComponentFixture<SiteDeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    site: Site,
    siteError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [SiteDeleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              site: siteResolvers.show,
            },
            {
              project: { model: project, error: projectError },
              site: { model: site, error: siteError },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteDeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(SitesService) as SpyObject<SitesService>;
    notifications = TestBed.inject(ToastrService);

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
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
      configureTestingModule(
        undefined,
        generateApiErrorDetails(),
        defaultSite,
        undefined
      );
      assertErrorHandler(fixture);
    });

    it("should handle site error", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      api.destroy.and.callFake(() => new Subject());
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to projects", () => {
      const spy = spyOnProperty(defaultProject, "viewUrl");
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
