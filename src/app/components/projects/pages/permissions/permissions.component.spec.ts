import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { PermissionsService } from "@baw-api/permissions/permissions.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { mockProvider } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { PermissionsComponent } from "./permissions.component";

// TODO Implement tests
describe("PermissionsComponent", () => {
  let component: PermissionsComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<PermissionsComponent>;

  function configureTestingModule(model: Project, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [PermissionsComponent],
      providers: [
        mockProvider(PermissionsService),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { project: projectResolvers.show },
            { project: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  assertPageInfo(PermissionsComponent, "Edit Permissions");

  it("should create", () => {
    configureTestingModule(defaultProject);
    expect(component).toBeTruthy();
  });

  // TODO Write unit tests
});
