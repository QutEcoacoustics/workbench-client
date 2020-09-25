import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { IProject, Project } from "@models/Project";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { DebounceInputComponent } from "@shared/debounce-input/debounce-input.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler, assertSpinner } from "@test/helpers/html";
import { Subject } from "rxjs";
import { ListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let api: SpyObject<ProjectsService>;
  let spectator: Spectator<ListComponent>;
  const createComponent = createComponentFactory({
    component: ListComponent,
    imports: [
      SharedModule,
      HttpClientModule,
      RouterTestingModule,
      MockBawApiModule,
    ],
  });

  function generateProjects(
    numProjects: number,
    overrides: IProject = {}
  ): Project[] {
    const projects = [];
    for (let i = 0; i < Math.min(numProjects, defaultApiPageSize); i++) {
      const project = new Project({ ...generateProject(), ...overrides });
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: { total: numProjects },
      });
      projects.push(project);
    }
    return projects;
  }

  async function handleApiRequest(
    models: Project[],
    error?: ApiErrorDetails,
    assertFilter: (filters: Filters<IProject>) => void = () => {}
  ) {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(subject, () => models ?? error, !models);
    api.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
  }

  function getCards() {
    return spectator.queryAll<HTMLElement>("baw-card-image");
  }

  function assertCardTitle(card: HTMLElement, title: string) {
    expect(
      card.querySelector<HTMLElement>(".card-title").innerText.trim()
    ).toBe(title);
  }

  function assertCardDescription(card: HTMLElement, description: string) {
    expect(card.querySelector(".card-text").innerHTML.trim()).toBe(description);
  }

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    api = spectator.inject(ProjectsService);
  });

  it("should initially request page 1", async () => {
    await handleApiRequest([], undefined, (filter) =>
      expect(filter.paging.page).toBe(1)
    );
  });

  it("should handle failed projects model", async () => {
    await handleApiRequest(undefined, generateApiErrorDetails());
    assertErrorHandler(spectator.fixture, true);
  });

  it("should display loading animation during request", async () => {
    handleApiRequest([]);
    assertSpinner(spectator.fixture, true);
  });

  it("should clear loading animation on response", async () => {
    await handleApiRequest([]);
    assertSpinner(spectator.fixture, false);
  });

  describe("projects", () => {
    it("should handle zero projects", async () => {
      await handleApiRequest([]);

      const title = spectator.query<HTMLHeadingElement>("h4");
      expect(title).toBeTruthy();
      expect(title.innerText.trim()).toBe("Your list of projects is empty");
      expect(getCards().length).toBe(0);
    });

    it("should display single project card", async () => {
      await handleApiRequest(generateProjects(1));
      const cards = getCards();
      expect(cards.length).toBe(1);
    });

    it("should display single project card with title", async () => {
      const projects = generateProjects(1);
      await handleApiRequest(projects);
      const cards = getCards();
      assertCardTitle(cards[0], projects[0].name);
    });

    it("should display single project card with default description", async () => {
      const projects = generateProjects(1, {
        descriptionHtmlTagline: undefined,
      });
      await handleApiRequest(projects);

      const cards = getCards();
      assertCardDescription(cards[0], "No description given");
    });

    it("should display single project card with custom description", async () => {
      const projects = generateProjects(1, {
        descriptionHtmlTagline: "<b>Custom</b> Description",
      });
      await handleApiRequest(projects);

      const cards = getCards();
      assertCardDescription(cards[0], "<b>Custom</b> Description");
    });

    it("should display multiple project cards", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      const cards = getCards();
      expect(cards.length).toBe(3);
    });

    it("should display multiple project cards in order", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);

      const cards = getCards();
      projects.forEach((project, index) =>
        assertCardTitle(cards[index], project.name)
      );
    });
  });

  describe("scrolling", () => {
    function getPagination() {
      return spectator.query(NgbPagination);
    }

    function getPaginationLinks() {
      return spectator.queryAll("ngb-pagination a");
    }

    it("should hide pagination if less than one page of models", async () => {
      const projects = generateProjects(5);
      await handleApiRequest(projects);
      expect(getPagination()).toBeFalsy();
    });

    it("should display pagination if more than one page of models", async () => {
      const projects = generateProjects(defaultApiPageSize * 2);
      await handleApiRequest(projects);
      expect(getPagination()).toBeTruthy();
    });

    it("should display correct number of pages", async () => {
      const projects = generateProjects(defaultApiPageSize * 3);
      await handleApiRequest(projects);
      // 3 Pages, 2 additional options to select forwards and back
      expect(getPaginationLinks().length).toBe(3 + 2);
    });
  });

  describe("filtering", () => {
    function getFilter() {
      return spectator.query(DebounceInputComponent);
    }

    it("should have filtering option", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getFilter()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spectator.component.filter = "custom value";
      spectator.detectChanges();
      expect(getFilter().default).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spyOn(spectator.component, "onFilter").and.stub();
      getFilter().filter.next("custom value");
      expect(spectator.component.onFilter).toHaveBeenCalled();
    });
  });
});
