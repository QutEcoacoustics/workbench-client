import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import { SharedModule } from "@components/shared/shared.module";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SpyObject } from "@ngneat/spectator";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { PointDeleteComponent } from "./point.component";

describe("PointDeleteComponent", () => {
  let api: SpyObject<SitesService>;
  let component: PointDeleteComponent;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let fixture: ComponentFixture<PointDeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    region: Region,
    site: Site,
    projectError?: ApiErrorDetails,
    regionError?: ApiErrorDetails,
    siteError?: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [PointDeleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              region: regionResolvers.show,
              site: siteResolvers.show,
            },
            {
              project: { model: project, error: projectError },
              region: { model: region, error: regionError },
              site: { model: site, error: siteError },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PointDeleteComponent);
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
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite(undefined, true));
  });

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(defaultProject, defaultRegion, defaultSite);
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject, defaultRegion, defaultSite);
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(
        undefined,
        defaultRegion,
        defaultSite,
        generateApiErrorDetails()
      );
      assertErrorHandler(fixture);
    });

    it("should handle region error", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        defaultSite,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      assertErrorHandler(fixture);
    });

    it("should handle site error", () => {
      configureTestingModule(
        defaultProject,
        defaultRegion,
        undefined,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject, defaultRegion, defaultSite);
      api.destroy.and.callFake(() => new Subject());
      component.submit({ ...defaultSite });
      expect(api.destroy).toHaveBeenCalledWith(
        new Site(defaultSite),
        defaultProject
      );
    });

    it("should redirect to projects", () => {
      const spy = spyOnProperty(defaultRegion, "viewUrl");
      configureTestingModule(defaultProject, defaultRegion, defaultSite);
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
