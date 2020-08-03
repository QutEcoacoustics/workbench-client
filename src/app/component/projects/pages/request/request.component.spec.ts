import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { mockActivatedRoute } from "src/app/test/helpers/testbed";
import { RequestComponent } from "./request.component";

xdescribe("ProjectsRequestComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: RequestComponent;
  let defaultProject: Project;
  let fixture: ComponentFixture<RequestComponent>;

  function configureTestingModule(model: Project, error?: ApiErrorDetails) {
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
          useClass: mockActivatedRoute(
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

  it("should create", () => {
    configureTestingModule(defaultProject);
    expect(component).toBeTruthy();
  });
});
