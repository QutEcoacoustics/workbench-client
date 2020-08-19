import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { testFormlyFields } from "@test/helpers/formly";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { mockActivatedRoute, testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { fields } from "../../project.schema.json";
import { EditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: EditComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<EditComponent>;
  let notifications: ToastrService;
  let router: Router;

  function configureTestingModule(model: Project, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [...testFormImports, MockBawApiModule],
      declarations: [EditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { project: projectResolvers.show },
            { project: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    api = TestBed.inject(ProjectsService) as SpyObject<ProjectsService>;
    notifications = TestBed.inject(ToastrService);

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Project Name Input",
        field: fields[0],
        key: "name",
        label: "Project Name",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Project Description Input",
        field: fields[1],
        key: "description",
        label: "Description",
        type: "textarea",
      },
      {
        testGroup: "Project Image Input",
        field: fields[2],
        key: "image",
        label: "Image",
        type: "image",
      },
    ]);
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject);
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(undefined, generateApiErrorDetails());
      assertResolverErrorHandling(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject);
      api.update.and.callFake(() => new Subject());
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });

    it("should handle general error", () => {
      configureTestingModule(defaultProject);
      api.update.and.callFake(() => {
        const subject = new Subject<Project>();
        subject.error(
          generateApiErrorDetails("Unauthorized", {
            message: "Sign in to access this feature.",
          })
        );
        return subject;
      });

      component.submit(defaultProject);
      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    });

    it("should handle duplicate project name", () => {
      configureTestingModule(defaultProject, undefined);
      api.update.and.callFake(() => {
        const subject = new Subject<Project>();
        subject.error(
          generateApiErrorDetails("Unprocessable Entity", {
            info: { name: ["has already been taken"] },
          })
        );

        return subject;
      });

      component.submit(defaultProject);

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    });
  });
});
