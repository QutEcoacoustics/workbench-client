import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { testFormlyFields } from "src/app/test/helpers/formly";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { fields } from "../../project.json";
import { NewComponent } from "./new.component";

describe("ProjectsNewComponent", () => {
  let api: ProjectsService;
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let notifications: ToastrService;
  let router: Router;

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
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [...appLibraryImports, SharedModule, RouterTestingModule],
        declarations: [NewComponent],
        providers: [
          ...testBawServices,
          {
            provide: ActivatedRoute,
            useClass: mockActivatedRoute(),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NewComponent);
      api = TestBed.inject(ProjectsService);
      router = TestBed.inject(Router);
      notifications = TestBed.inject(ToastrService);
      component = fixture.componentInstance;

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
      spyOn(router, "navigateByUrl").and.stub();

      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should call api", () => {
      spyOn(api, "create").and.callThrough();
      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should handle general error", () => {
      spyOn(api, "create").and.callFake(() => {
        const subject = new Subject<Project>();

        subject.error({
          message: "Sign in to access this feature.",
          info: 401,
        } as ApiErrorDetails);

        return subject;
      });

      component.submit({});

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    });

    it("should handle duplicate project name", () => {
      spyOn(api, "create").and.callFake(() => {
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

      component.submit({});

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    });
  });
});
