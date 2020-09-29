import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { DeleteComponent } from "./delete.component";

describe("RegionsDeleteComponent", () => {
  let api: SpyObject<RegionsService>;
  let component: DeleteComponent;
  let defaultRegion: Region;
  let defaultProject: Project;
  let fixture: ComponentFixture<DeleteComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    region: Region,
    regionError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [DeleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              region: regionResolvers.show,
            },
            {
              project: { model: project, error: projectError },
              region: { model: region, error: regionError },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(RegionsService) as SpyObject<RegionsService>;
    notifications = TestBed.inject(ToastrService);

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
  });

  describe("form", () => {
    it("should have no fields", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        defaultRegion,
        undefined
      );
      expect(component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        defaultRegion,
        undefined
      );
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(
        undefined,
        generateApiErrorDetails(),
        defaultRegion,
        undefined
      );
      assertErrorHandler(fixture);
    });

    it("should handle region error", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        defaultRegion,
        undefined
      );
      api.destroy.and.callFake(() => new Subject());
      component.submit({});
      expect(api.destroy).toHaveBeenCalled();
    });

    it("should redirect to projects", () => {
      const spy = spyOnProperty(defaultProject, "viewUrl");
      configureTestingModule(
        defaultProject,
        undefined,
        defaultRegion,
        undefined
      );
      api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

      component.submit({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
