import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CmsService } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { DirectivesModule } from "@directives/directives.module";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { Project } from "@models/Project";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardImageComponent } from "@shared/cards/card-image/card-image.component";
import { CardsComponent } from "@shared/cards/cards.component";
import { IconsModule } from "@shared/icons/icons.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { BehaviorSubject, Subject } from "rxjs";
import { HomeComponent } from "./home.component";

const mockCardComponent = MockComponent(CardImageComponent);

describe("HomeComponent", () => {
  let projectApi: SpyObject<ProjectsService>;
  let cmsService: SpyObject<CmsService>;
  let spec: Spectator<HomeComponent>;
  const createComponent = createComponentFactory({
    component: HomeComponent,
    declarations: [CardsComponent, mockCardComponent],
    imports: [
      MockBawApiModule,
      IconsModule,
      DirectivesModule,
      RouterTestingModule,
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
    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function getCards(): CardsComponent {
    return spec.query(CardsComponent);
  }

  function getButton(): HTMLButtonElement {
    return spec.query("baw-cards a.btn");
  }

  function handleCms() {
    cmsService = spec.inject(CmsService);
    cmsService.get.and.callFake(() => new BehaviorSubject("cms content"));
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    projectApi = spec.inject(ProjectsService);
  });

  // TODO Re-enable once cms is setup
  /* assertCms<HomeComponent>(async () => {
    projectApi.filter.and.callFake(() => new Subject());
    return spec;
  }, CMS.home); */

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
      expect(getCards().cards.count()).toBe(0);
      expect(getButton()).toBeTruthy();
    });
  });

  describe("cards", () => {
    beforeEach(() => handleCms());

    it("should create", async () => {
      await interceptProjects();
      expect(spec.component).toBeTruthy();
    });

    it("should display no projects", async () => {
      await interceptProjects([]);
      expect(getCards().cards.count()).toBe(0);
      expect(getButton()).toBeTruthy();
    });

    it("should display single project", async () => {
      const project = new Project(generateProject());
      await interceptProjects([project]);
      expect(getCards().cards.count()).toBe(1);
      expect(getCards().cards.first()).toEqual(project.getCard());
      expect(getButton()).toBeTruthy();
    });

    it("should display multiple projects", async () => {
      const projects = [
        new Project(generateProject()),
        new Project(generateProject()),
        new Project(generateProject()),
      ];

      await interceptProjects(projects);

      const cards = getCards().cards;
      expect(getCards().cards.count()).toBe(3);
      projects.forEach((project, index) =>
        expect(cards.get(index)).toEqual(project.getCard())
      );
      expect(getButton()).toBeTruthy();
    });

    it("should link to project details page", async () => {
      await interceptProjects([]);

      const button = getButton();
      expect(button).toBeTruthy();
      expect(button).toHaveText("More Projects");
      expect(spec.queryLast(StrongRouteDirective).strongRoute).toEqual(
        projectsMenuItem.route
      );
    });
  });
});
