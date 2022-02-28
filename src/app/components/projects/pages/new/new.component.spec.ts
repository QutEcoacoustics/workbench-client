import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { testFormlyFields } from "@test/helpers/formly";
import { mockActivatedRoute, testFormImports } from "@test/helpers/testbed";
import { UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import schema from "../../project.schema.json";
import { NewComponent } from "./new.component";

describe("ProjectsNewComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let notifications: ToastrService;
  let router: Router;
  const { fields } = schema;

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
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [...testFormImports, MockBawApiModule],
        declarations: [NewComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute(),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NewComponent);
      api = TestBed.inject(ProjectsService) as SpyObject<ProjectsService>;
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
      api.create.and.callFake(() => new Subject());
      component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should handle general error", () => {
      api.create.and.callFake(() => {
        const subject = new Subject<Project>();
        subject.error(
          new BawApiError(UNAUTHORIZED, "Sign in to access this feature.")
        );
        return subject;
      });

      component.submit({});

      expect(notifications.error).toHaveBeenCalledWith(
        "Sign in to access this feature."
      );
    });

    it("should handle duplicate project name", () => {
      api.create.and.callFake(() => {
        const subject = new Subject<Project>();
        subject.error(
          generateBawApiError(
            UNPROCESSABLE_ENTITY,
            "Record could not be saved",
            { name: ["has already been taken"] }
          )
        );
        return subject;
      });

      component.submit({});

      expect(notifications.error).toHaveBeenCalledWith(
        "Record could not be saved<br />name has already been taken"
      );
    });
  });
});
