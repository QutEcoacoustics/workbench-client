import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { RequestComponent } from "./request.component";

describe("ProjectsRequestComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: RequestComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<RequestComponent>;

  function configureTestingModule(model: Project, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [RequestComponent],
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

    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ProjectsService) as SpyObject<ProjectsService>;
    api.list.and.callFake(() => new Subject());

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  xit("should create", () => {
    configureTestingModule(defaultProject);
    expect(component).toBeTruthy();
  });
});
