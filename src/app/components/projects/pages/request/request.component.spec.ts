import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.config";
import { RequestComponent } from "./request.component";

describe("ProjectsRequestComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: RequestComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<RequestComponent>;

  function configureTestingModule(model: Project, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, RequestComponent],
      providers: [
        provideMockBawApi(),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { project: projectResolvers.show },
            { project: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ProjectsService) as SpyObject<ProjectsService>;
    api.list.and.callFake(() => new Subject());

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  assertPageInfo(RequestComponent, "Request Access");

  it("should create", () => {
    configureTestingModule(defaultProject);
    expect(component).toBeInstanceOf(RequestComponent);
  });
});
