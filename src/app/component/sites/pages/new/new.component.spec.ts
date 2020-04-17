import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { projectResolvers } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertResolverErrorHandling, testFormlyFields } from "src/testHelpers";
import { fields } from "../../site.json";
import { NewComponent } from "./new.component";

describe("SitesNewComponent", () => {
  let api: SitesService;
  let component: NewComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<NewComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [NewComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
            },
            {
              project: {
                model: project,
                error: projectError,
              },
            },
            { projectId: project?.id }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
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
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

  // TODO Add timezone checks
  const formInputs = [
    {
      testGroup: "Site Name Input",
      setup: undefined,
      field: fields[0],
      key: "name",
      htmlType: "input",
      required: true,
      label: "Site Name",
      type: "text",
      description: undefined,
    },
    {
      testGroup: "Site Description Input",
      setup: undefined,
      field: fields[1],
      key: "description",
      htmlType: "textarea",
      required: false,
      label: "Description",
      type: undefined,
      description: undefined,
    },
    {
      testGroup: "Site Latitude Input",
      setup: undefined,
      field: fields[2].fieldGroup[0],
      key: "customLatitude",
      htmlType: "input",
      required: false,
      label: "Latitude",
      type: "number",
      description: undefined,
    },
    {
      testGroup: "Site Longitude Input",
      setup: undefined,
      field: fields[2].fieldGroup[1],
      key: "customLongitude",
      htmlType: "input",
      required: false,
      label: "Longitude",
      type: "number",
      description: undefined,
    },
    {
      testGroup: "Site Image Input",
      setup: undefined,
      field: fields[3],
      key: "image",
      htmlType: "image",
      required: false,
      label: "Image",
      type: undefined,
      description: undefined,
    },
  ];

  describe("form", () => {
    testFormlyFields(formInputs);

    // TODO Add input validation for custom location logic
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject, undefined);

      expect(component).toBeTruthy();
    });

    it("should handle project error", fakeAsync(() => {
      configureTestingModule(undefined, defaultError);
      assertResolverErrorHandling(fixture);
    }));

    it("should call api", () => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "create").and.callThrough();

      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      configureTestingModule(defaultProject, undefined);
      const site = new Site({ id: 1, name: "Site" });
      spyOn(site, "navigationPath").and.stub();
      spyOn(api, "create").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.navigationPath).toHaveBeenCalled();
    });

    it("should redirect to site with project", () => {
      configureTestingModule(defaultProject, undefined);
      const site = new Site({ id: 1, name: "Site" });
      spyOn(site, "navigationPath").and.stub();
      spyOn(api, "create").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.navigationPath).toHaveBeenCalledWith(defaultProject);
    });
  });
});
