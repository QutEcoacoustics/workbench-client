import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { userResolvers } from "@baw-api/user/user.service";
import { IProject, Project } from "@models/Project";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateUser } from "@test/fakes/User";
import { assertErrorHandler, assertRoute } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { BehaviorSubject } from "rxjs";
import { MyProjectsComponent } from "./my-projects.component";

describe("MyProjectsComponent", () => {
  let api: SpyObject<ProjectsService>;
  let component: MyProjectsComponent;
  let defaultUser: User;
  let fixture: ComponentFixture<MyProjectsComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MyProjectsComponent],
      imports: [SharedModule, RouterTestingModule, MockBawApiModule],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { user: userResolvers.show },
            { user: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsComponent);
    api = TestBed.inject(ProjectsService) as SpyObject<ProjectsService>;
    component = fixture.componentInstance;
  }

  function setProject(data?: IProject): Project {
    if (!data) {
      api.filter.and.callFake(() => {
        return new BehaviorSubject<Project[]>([]);
      });
      return;
    }

    const project = new Project({ ...generateProject(), ...data });
    project.addMetadata({
      status: 200,
      message: "OK",
      paging: {
        page: 1,
        items: defaultApiPageSize,
        total: 1,
        maxPage: 1,
      },
    });

    api.filter.and.callFake(
      () => new BehaviorSubject<Project[]>([project])
    );

    return project;
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    setProject();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display username in title", () => {
    configureTestingModule(
      new User({ ...generateUser(), userName: "custom username" })
    );
    setProject();
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("small");
    expect(title.innerText.trim()).toContain("custom username");
  });

  it("should handle user error", () => {
    configureTestingModule(undefined, generateApiErrorDetails());
    setProject();
    fixture.detectChanges();
    expect(component).toBeTruthy();

    assertErrorHandler(fixture);
  });

  describe("table", () => {
    function getCells(): NodeListOf<HTMLDivElement> {
      return fixture.nativeElement.querySelectorAll("datatable-body-cell");
    }

    it("should display project name", () => {
      configureTestingModule(defaultUser);
      setProject({ name: "custom project" });
      fixture.detectChanges();

      expect(getCells()[0].innerText.trim()).toBe("custom project");
    });

    it("should display project name link", () => {
      configureTestingModule(defaultUser);
      const project = setProject({ name: "custom project" });
      fixture.detectChanges();

      const link = getCells()[0].querySelector("a");
      assertRoute(link, project.viewUrl);
    });

    it("should display number of sites", () => {
      configureTestingModule(defaultUser);
      setProject({ siteIds: [1, 2, 3, 4, 5] });
      fixture.detectChanges();

      expect(getCells()[1].innerText).toBe("5");
    });

    // TODO Implement
    xit("should display reader permissions", () => {});
    xit("should display writer permissions", () => {});
    xit("should display owner permissions", () => {});
    xit("should display owner permissions link", () => {});
  });
});
