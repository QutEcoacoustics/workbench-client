import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { SharedModule } from "@shared/shared.module";
import { testFormlyFields } from "@test/helpers/formly";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { fields } from "../../site.base.json";
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
    defaultProject = new Project({ id: 1, name: "Project" });
    defaultError = { status: 401, message: "Unauthorized" };
  });

  // TODO Add timezone checks
  const formInputs = [
    {
      testGroup: "Site Name Input",
      setup: undefined,
      field: fields[1],
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
      field: fields[2],
      key: "description",
      htmlType: "textarea",
      required: false,
      label: "Description",
      type: undefined,
      description: undefined,
    },
    {
      testGroup: "Site Location Input",
      setup: undefined,
      field: fields[4],
      key: "location",
      htmlType: "input",
      required: false,
      label: "Location",
      type: undefined,
      description: undefined,
    },
    {
      testGroup: "Site Image Input",
      setup: undefined,
      field: fields[9],
      key: "imageUrl",
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
      spyOn(site, "getViewUrl").and.stub();
      spyOn(api, "create").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.getViewUrl).toHaveBeenCalled();
    });

    it("should redirect to site with project", () => {
      configureTestingModule(defaultProject, undefined);
      const site = new Site({ id: 1, name: "Site" });
      spyOn(site, "getViewUrl").and.stub();
      spyOn(api, "create").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.getViewUrl).toHaveBeenCalledWith(defaultProject);
    });
  });
});
