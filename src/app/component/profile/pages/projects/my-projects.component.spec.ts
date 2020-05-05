import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { userResolvers } from "@baw-api/user/user.service";
import { IProject, Project } from "@models/Project";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { BehaviorSubject } from "rxjs";
import {
  assertResolverErrorHandling,
  assertRoute,
} from "src/app/test/helpers/html";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { MyProjectsComponent } from "./my-projects.component";

describe("MyProjectsComponent", () => {
  let api: ProjectsService;
  let component: MyProjectsComponent;
  let defaultUser: User;
  let defaultError: ApiErrorDetails;
  let fixture: ComponentFixture<MyProjectsComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MyProjectsComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { account: userResolvers.show },
            { account: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsComponent);
    api = TestBed.inject(ProjectsService);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    defaultUser = new User({ id: 1, userName: "username" });
    defaultError = { status: 401, message: "Unauthorized" };
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display username in title", () => {
    configureTestingModule(
      new User({ ...defaultUser, userName: "custom username" })
    );
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("small");
    expect(title.innerText.trim()).toContain("custom username");
  });

  it("should handle user error", () => {
    configureTestingModule(undefined, defaultError);
    fixture.detectChanges();
    expect(component).toBeTruthy();

    assertResolverErrorHandling(fixture);
  });

  describe("table", () => {
    function setProject(data: IProject): Project {
      const project = new Project({ id: 1, name: "project", ...data });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          items: 25,
          total: 1,
          maxPage: 1,
        },
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Project[]>([project]);
      });

      return project;
    }

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
