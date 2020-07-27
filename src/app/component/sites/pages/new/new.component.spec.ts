import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { MockMapComponent } from "@shared/map/mapMock";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { FormlyFieldTestSuite, testFormlyFields } from "@test/helpers/formly";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
import { MockToastrService } from "@test/helpers/toastr";
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
    projectError?: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [NewComponent, MockMapComponent],
      providers: [
        ...testBawServices,
        { provide: ToastrService, useClass: MockToastrService },
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { project: projectResolvers.show },
            { project: { model: project, error: projectError } },
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

    spyOn(router, "navigateByUrl").and.stub();
    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultError = { status: 401, message: "Unauthorized" };
  });

  const formInputs: FormlyFieldTestSuite[] = [
    {
      testGroup: "Site Name Input",
      field: fields[1],
      key: "name",
      htmlType: "input",
      required: true,
      label: "Site Name",
      type: "text",
    },
    {
      testGroup: "Site Description Input",
      field: fields[2],
      key: "description",
      htmlType: "textarea",
      label: "Description",
    },
    {
      testGroup: "Site Location Input",
      field: fields[4],
      key: "location",
      label: "Location",
    },
    {
      testGroup: "Site Image Input",
      field: fields[9],
      key: "imageUrl",
      htmlType: "image",
      label: "Image",
    },
  ];

  describe("form", () => {
    testFormlyFields(formInputs);
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject);
      expect(component).toBeTruthy();
    });

    it("should handle project error", fakeAsync(() => {
      configureTestingModule(undefined, defaultError);
      assertResolverErrorHandling(fixture);
    }));

    it("should call api", () => {
      configureTestingModule(defaultProject);
      spyOn(api, "create").and.callThrough();

      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      configureTestingModule(defaultProject);
      const site = new Site(generateSite());
      spyOn(site, "getViewUrl").and.stub();
      spyOn(api, "create").and.callFake(() => new BehaviorSubject<Site>(site));

      component.submit({});
      expect(site.getViewUrl).toHaveBeenCalledWith(defaultProject);
    });
  });
});
