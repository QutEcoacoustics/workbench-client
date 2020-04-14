import { ComponentFixture, TestBed } from "@angular/core/testing";
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
import {
  siteResolvers,
  SitesService,
} from "src/app/services/baw-api/sites.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertFormErrorHandling, testFormlyFields } from "src/testHelpers";
import { fields } from "../../site.json";
import { EditComponent } from "./edit.component";

describe("SitesEditComponent", () => {
  let api: SitesService;
  let component: EditComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let defaultSite: Site;
  let fixture: ComponentFixture<EditComponent>;
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
      declarations: [EditComponent],
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

    fixture = TestBed.createComponent(EditComponent);
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
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);

      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(undefined, defaultError, defaultSite, undefined);
      assertFormErrorHandling(fixture);
    });

    it("should handle site error", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        undefined,
        defaultError
      );
      assertFormErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      spyOn(api, "update").and.callThrough();

      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      const site = new Site({ id: 1, name: "Site" });
      spyOn(site, "navigationPath").and.stub();
      spyOn(api, "update").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.navigationPath).toHaveBeenCalled();
    });

    it("should redirect to site with project", () => {
      configureTestingModule(defaultProject, undefined, defaultSite, undefined);
      const site = new Site({ id: 1, name: "Site" });
      spyOn(site, "navigationPath").and.stub();
      spyOn(api, "update").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.navigationPath).toHaveBeenCalledWith(defaultProject);
    });
  });
});
