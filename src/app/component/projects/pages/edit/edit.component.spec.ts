import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { testFormlyFields } from "src/app/test/helpers/formly";
import { assertResolverErrorHandling } from "src/app/test/helpers/html";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { fields } from "../../project.json";
import { EditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  let api: ProjectsService;
  let component: EditComponent;
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let fixture: ComponentFixture<EditComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails
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
            },
            {
              project: {
                model: project,
                error: projectError,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(ProjectsService);
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

  const formInputs = [
    {
      testGroup: "Project Name Input",
      setup: undefined,
      field: fields[0],
      key: "name",
      htmlType: "input",
      required: true,
      label: "Project Name",
      type: "text",
      description: undefined,
    },
    {
      testGroup: "Project Description Input",
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
      testGroup: "Project Image Input",
      setup: undefined,
      field: fields[2],
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
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject, undefined);
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(undefined, defaultError);
      assertResolverErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update").and.callThrough();
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should handle general error", () => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401,
        } as ApiErrorDetails);

        return subject;
      });

      component.submit(defaultProject);

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    });

    it("should handle duplicate project name", () => {
      configureTestingModule(defaultProject, undefined);
      spyOn(api, "update").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Record could not be saved",
          status: 422,
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: [],
          },
        } as ApiErrorDetails);

        return subject;
      });

      component.submit(defaultProject);

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    });
  });
});
