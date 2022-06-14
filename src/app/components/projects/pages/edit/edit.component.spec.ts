import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { mockActivatedRoute, testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import schema from "../../project.schema.json";
import { EditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: EditComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<EditComponent>;
  let notifications: ToastrService;
  let router: Router;
  const { fields } = schema;

  function configureTestingModule(model: Project, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...testFormImports, MockBawApiModule],
      declarations: [EditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
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
      {
        testGroup: "Project Allow Original Download",
        field: fields[3],
        key: "allowOriginalDownload",
        label: "Allow whole audio recording downloads",
        type: "select",
      },
      {
        testGroup: "Project Allow Recording Uploads",
        field: fields[4],
        key: "allowAudioUpload",
        label: "Allow audio recording uploads",
        type: "checkbox",
      },
    ]);
  });

  describe("component", () => {
    it("should create", () => {
      configureTestingModule(defaultProject);
      expect(component).toBeTruthy();
    });

    it("should handle project error", () => {
      configureTestingModule(undefined, generateBawApiError());
      assertErrorHandler(fixture);
    });

    it("should call api", () => {
      configureTestingModule(defaultProject);
      api.update.and.callFake(() => new Subject());
      component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
