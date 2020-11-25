import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CMS, CmsService } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { SecurityService } from "@baw-api/security/security.service";
import { Project } from "@models/Project";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardImageComponent } from "@shared/cards/card-image/card-image.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { assertCms } from "@test/helpers/api-common";
import { nStepObservable } from "@test/helpers/general";
import { assertRoute } from "@test/helpers/html";
import { BehaviorSubject, Subject } from "rxjs";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let projectApi: SpyObject<ProjectsService>;
  let securityApi: SpyObject<SecurityService>;
  let cmsService: SpyObject<CmsService>;
  let spectator: Spectator<HomeComponent>;
  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [
      SharedModule,
      RouterTestingModule,
      HttpClientTestingModule,
      MockBawApiModule,
    ],
  });

  async function interceptProjects(
    projects: Project[] = [],
    error?: ApiErrorDetails
  ) {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(
      subject,
      () => (error ? error : projects),
      !projects
    );
    projectApi.filter.and.callFake(() => subject);
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
  }

  function getCardImages() {
    return spectator.queryAll(CardImageComponent);
  }

  function getButton() {
    return spectator.query<HTMLButtonElement>("a.btn");
  }

  function handleCms() {
    cmsService = spectator.inject(CmsService);
    cmsService.get.and.callFake(() => new BehaviorSubject("cms content"));
  }

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    projectApi = spectator.inject(ProjectsService);
    securityApi = spectator.inject(SecurityService);
  });

  assertCms<HomeComponent>(async () => {
    projectApi.filter.and.callFake(() => new Subject());
    return spectator;
  }, CMS.HOME);

  describe("api", () => {
    beforeEach(() => handleCms());

    it("should request 3 projects", async () => {
      await interceptProjects();
      expect(projectApi.filter).toHaveBeenCalledWith({
        paging: { items: 3 },
        sorting: { orderBy: "updatedAt", direction: "desc" },
      });
    });

    it("should handle filter error", async () => {
      await interceptProjects(undefined, generateApiErrorDetails());
      expect(getCardImages().length).toBe(0);
      expect(getButton()).toBeTruthy();
    });
  });

  describe("cards", () => {
    beforeEach(() => handleCms());

    it("should create", async () => {
      await interceptProjects();
      expect(spectator.component).toBeTruthy();
    });

    it("should display no projects", async () => {
      await interceptProjects([]);
      expect(getCardImages().length).toBe(0);
      expect(getButton()).toBeTruthy();
    });

    it("should display single project", async () => {
      await interceptProjects([new Project(generateProject())]);
      expect(getCardImages().length).toBe(1);
      expect(getButton()).toBeTruthy();
    });

    it("should display project name", async () => {
      await interceptProjects([
        new Project({ ...generateProject(), name: "Project" }),
      ]);

      const cards = getCardImages();
      expect(cards[0].card.title).toBe("Project");
    });

    it("should display description", async () => {
      await interceptProjects([
        new Project({
          ...generateProject(),
          descriptionHtmlTagline: "Description",
        }),
      ]);

      const cards = getCardImages();
      expect(cards[0].card.description).toBe("Description");
    });

    it("should display missing description", async () => {
      await interceptProjects([
        new Project({
          ...generateProject(),
          descriptionHtmlTagline: undefined,
        }),
      ]);

      const cards = getCardImages();
      expect(cards[0].card.description).toBe(undefined);
    });

    it("should display multiple projects", async () => {
      const ids = [1, 2, 3];
      const names = ids.map((id) => `Project ${id}`);
      const descriptions = ids.map((id) => `Description ${id}`);
      await interceptProjects(
        ids.map(
          (id, index) =>
            new Project({
              ...generateProject(id),
              name: names[index],
              descriptionHtmlTagline: descriptions[index],
            })
        )
      );

      const cards = getCardImages();
      expect(cards.length).toBe(ids.length);
      expect(getButton()).toBeTruthy();
      ids.forEach((_, index) => {
        expect(cards[index].card.title).toBe(names[index]);
        expect(cards[index].card.description).toBe(descriptions[index]);
      });
    });

    it("should link to project details page", async () => {
      await interceptProjects([]);

      const button = getButton();
      expect(button).toBeTruthy();
      expect(button.innerText.trim()).toBe("More Projects");
      assertRoute(button, "/projects");
    });
  });
});
