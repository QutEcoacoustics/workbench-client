import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { PermissionsComponent } from "./permissions.component";

describe("PermissionsComponent", () => {
  let component: PermissionsComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<PermissionsComponent>;

  function configureTestingModule(model: Project, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [PermissionsComponent],
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

    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  it("should create", () => {
    configureTestingModule(defaultProject);
    expect(component).toBeTruthy();
  });

  // TODO Write unit tests
});
