import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { SecurityService } from "@baw-api/security/security.service";
import { Project } from "@models/Project";
import { AppConfigService } from "@services/app-config/app-config.service";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { assertRoute } from "@test/helpers/html";
import { BehaviorSubject, Subject } from "rxjs";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let httpMock: HttpTestingController;
  let projectApi: ProjectsService;
  let securityApi: SecurityService;
  let component: HomeComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<HomeComponent>;
  let cmsUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    projectApi = TestBed.inject(ProjectsService);
    securityApi = TestBed.inject(SecurityService);
    env = TestBed.inject(AppConfigService);

    cmsUrl = env.environment.cmsRoot + "/home.html";
  });

  afterEach(() => {
    httpMock.verify();
  });

  function interceptCmsRequest() {
    const req = httpMock.expectOne(cmsUrl);
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
  }

  it("should load cms", async () => {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(subject, () => []);
    spyOn(projectApi, "filter").and.callFake(() => subject);
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );

    await promise;
    fixture.detectChanges();
    interceptCmsRequest();
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("h1");
    const body = fixture.nativeElement.querySelector("p");

    expect(header).toBeTruthy();
    expect(header.innerText.trim()).toBe("Test Header");
    expect(body).toBeTruthy();
    expect(body.innerText.trim()).toBe("Test Description");
  });

  describe("page", () => {
    async function setupComponent(
      projects: Project[],
      error?: ApiErrorDetails
    ) {
      const subject = new Subject<Project[]>();
      const promise = nStepObservable(
        subject,
        () => (projects ? projects : error),
        !projects
      );
      spyOn(projectApi, "filter").and.callFake(() => subject);
      spyOn(securityApi, "getAuthTrigger").and.callFake(
        () => new BehaviorSubject(null)
      );

      fixture.detectChanges();
      await promise;
      interceptCmsRequest();
      fixture.detectChanges();
    }

    function getCardImages() {
      return fixture.nativeElement.querySelectorAll("baw-card-image");
    }

    function getCardTitle(card: HTMLElement): HTMLElement {
      return card.querySelector(".card-title");
    }

    function getCardText(card: HTMLElement): HTMLElement {
      return card.querySelector(".card-text");
    }

    function getButton() {
      return fixture.nativeElement.querySelector("button");
    }

    it("should create", async () => {
      await setupComponent([]);
      expect(component).toBeTruthy();
    });

    it("should request 3 projects", async () => {
      await setupComponent([]);
      expect(projectApi.filter).toHaveBeenCalledWith({
        paging: { items: 3 },
      } as Filters);
    });

    it("should handle filter error", async () => {
      await setupComponent(undefined, { status: 404, message: "Not Found" });
      expect(getCardImages().length).toBe(0);
      expect(getButton()).toBeTruthy();
    });

    it("should display no projects", async () => {
      await setupComponent([]);
      expect(getCardImages().length).toBe(0);
      expect(getButton()).toBeTruthy();
    });

    it("should display single project", async () => {
      await setupComponent([new Project(generateProject())]);

      const cards = getCardImages();
      expect(cards.length).toBe(1);
      expect(getButton()).toBeTruthy();
    });

    it("should display project name", async () => {
      await setupComponent([
        new Project({ ...generateProject(), name: "Project" }),
      ]);

      const cards = getCardImages();
      expect(getCardTitle(cards[0]).innerText.trim()).toBe("Project");
    });

    it("should display description", async () => {
      await setupComponent([
        new Project({
          ...generateProject(),
          description: "Description",
        }),
      ]);

      const cards = getCardImages();
      expect(getCardText(cards[0]).innerText.trim()).toBe("Description");
    });

    it("should display missing description", async () => {
      await setupComponent([
        new Project({
          ...generateProject(),
          description: undefined,
        }),
      ]);

      const cards = getCardImages();
      expect(getCardText(cards[0]).innerText.trim()).toBe(
        "No description given"
      );
    });

    it("should display multiple projects", async () => {
      const ids = [1, 2, 3];
      const names = ids.map((id) => `Project ${id}`);
      const descriptions = ids.map((id) => `Description ${id}`);
      await setupComponent(
        ids.map(
          (id, index) =>
            new Project({
              ...generateProject(id),
              name: names[index],
              description: descriptions[index],
            })
        )
      );

      const cards = getCardImages();
      expect(cards.length).toBe(ids.length);
      expect(getButton()).toBeTruthy();
      ids.forEach((_, index) => {
        expect(getCardTitle(cards[index]).innerText.trim()).toBe(names[index]);
        expect(getCardText(cards[index]).innerText.trim()).toBe(
          descriptions[index]
        );
      });
    });

    it("should link to project details page", async () => {
      await setupComponent([]);

      const button = getButton();
      expect(button).toBeTruthy();
      expect(button.innerText.trim()).toBe("More Projects");
      assertRoute(button, "/projects");
    });
  });
});
