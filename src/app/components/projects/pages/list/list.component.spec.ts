import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { IProject, Project } from "@models/Project";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { FilterComponent } from "@shared/filter/filter.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { List } from "immutable";
import {
  InfiniteScrollDirective,
  InfiniteScrollModule,
} from "ngx-infinite-scroll";
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
      InfiniteScrollModule,
    ],
  });

  function generateProjects(
    numProjects: number,
    maxPage: number,
    overrides: IProject = {}
  ): Project[] {
    const projects = [];
    for (let i = 0; i < numProjects; i++) {
      const project = new Project({ ...generateProject(), ...overrides });
      project.addMetadata({ paging: { maxPage } } as any);
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

  function promiseMultipleRequests(
    numResponses: number,
    assertFilters?: ((filters: Filters<IProject>) => void)[]
  ) {
    const requests: { projects: Project[]; subject: Subject<Project[]> }[] = [];
    const promises: Promise<any>[] = [];
    const projects: Project[] = [];

    for (let i = 0; i < numResponses; i++) {
      requests.push({
        projects: generateProjects(25, numResponses),
        subject: new Subject(),
      });
      promises.push(
        nStepObservable(
          requests[i].subject,
          () => requests[i].projects,
          false,
          i
        )
      );
      projects.push(...requests[i].projects);
    }

    let count = -1;
    api.filter.and.callFake((filters: Filters<IProject>) => {
      count++;
      assertFilters?.[count]?.(filters);
      return requests?.[count]?.subject ?? 1;
    });
    return { promises, projects, requests };
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

  it("should display loading animation during request", async () => {
    handleApiRequest([]);
    assertSpinner(spectator.fixture, true);
  });

  it("should clear loading animation on response", async () => {
    await handleApiRequest([]);
    assertSpinner(spectator.fixture, false);
  });

  it("should handle zero projects", async () => {
    await handleApiRequest([]);

    const title = spectator.query<HTMLHeadingElement>("h4");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("Your list of projects is empty");
    expect(getCards().length).toBe(0);
  });

  it("should display single project card", async () => {
    await handleApiRequest(generateProjects(1, 1));
    const cards = getCards();
    expect(cards.length).toBe(1);
  });

  it("should display single project card with title", async () => {
    const projects = generateProjects(1, 1);
    await handleApiRequest(projects);
    const cards = getCards();
    assertCardTitle(cards[0], projects[0].name);
  });

  it("should display single project card with default description", async () => {
    const projects = generateProjects(1, 1, {
      descriptionHtmlTagline: undefined,
    });
    await handleApiRequest(projects);

    const cards = getCards();
    assertCardDescription(cards[0], "No description given");
  });

  it("should display single project card with custom description", async () => {
    const projects = generateProjects(1, 1, {
      descriptionHtmlTagline: "<b>Custom</b> Description",
    });
    await handleApiRequest(projects);

    const cards = getCards();
    assertCardDescription(cards[0], "<b>Custom</b> Description");
  });

  it("should display multiple project cards", async () => {
    const projects = generateProjects(3, 1);
    await handleApiRequest(projects);
    const cards = getCards();
    expect(cards.length).toBe(3);
  });

  it("should display multiple project cards in order", async () => {
    const projects = generateProjects(3, 1);
    await handleApiRequest(projects);

    const cards = getCards();
    projects.forEach((project, index) =>
      assertCardTitle(cards[index], project.name)
    );
  });

  it("should handle failed projects model", async () => {
    await handleApiRequest(undefined, generateApiErrorDetails());
    expect(spectator.query("baw-error-handler h1")).toBeTruthy();
  });

  describe("scrolling", () => {
    function getScrollDirective() {
      return spectator.query(InfiniteScrollDirective);
    }

    function scrollPage() {
      const directive = getScrollDirective();
      directive.scrolled.next();
      spectator.detectChanges();
    }

    it("should detect scrolling", async () => {
      const spy = jasmine.createSpy();
      spectator.component.onScroll = spy;

      await handleApiRequest(generateProjects(25, 2));
      expect(spy).not.toHaveBeenCalled();
      scrollPage();
      expect(spy).toHaveBeenCalled();
    });

    it("should request page 2 on scroll", async (done) => {
      const { promises } = promiseMultipleRequests(2, [
        (filter) => expect(filter.paging.page).toBe(1),
        (filter) => {
          expect(filter.paging.page).toBe(2);
          done();
        },
      ]);

      await promises[0];
      spectator.detectChanges();
      scrollPage();
      await promises[1];
    });

    it("should disable infinite scroll after maxPage", async () => {
      const { promises } = promiseMultipleRequests(2);
      await promises[0];
      spectator.detectChanges();
      expect(getScrollDirective().infiniteScrollDisabled).toBeFalsy();
      scrollPage();
      await promises[1];
      spectator.detectChanges();
      expect(getScrollDirective().infiniteScrollDisabled).toBeTruthy();
    });

    it("should append new project cards", async () => {
      const { promises, projects } = promiseMultipleRequests(2);
      spectator.detectChanges();
      await promises[0];
      spectator.detectChanges();
      scrollPage();
      await promises[1];
      spectator.detectChanges();

      expect(spectator.component.cardList.toArray()).toEqual(
        List(projects.map((project) => project.getCard())).toArray()
      );
    });
  });

  describe("filtering", () => {
    function filterProjects(name: string) {
      const filter = spectator.query(FilterComponent);
      filter.filter.next(name);
      spectator.detectChanges();
    }

    it("should detect filter", async () => {
      const spy = jasmine.createSpy();
      spectator.component.onFilter = spy.and.callThrough();

      await handleApiRequest(generateProjects(25, 2));
      expect(spy).not.toHaveBeenCalled();
      filterProjects("project");
      expect(spy).toHaveBeenCalled();
    });

    it("should add project name to filter", async (done) => {
      const { promises } = promiseMultipleRequests(2, [
        (filters) => expect(filters.filter).toBe(undefined),
        (filters) => {
          expect(filters.filter).toEqual({ name: { contains: "project" } });
          done();
        },
      ]);

      await promises[0];
      spectator.detectChanges();
      filterProjects("project");
      await promises[1];
      spectator.detectChanges();
    });

    it("should handle clearing filter", async (done) => {
      const { promises } = promiseMultipleRequests(3, [
        (filters) => expect(filters.filter).toBe(undefined),
        (filters) =>
          expect(filters.filter).toEqual({ name: { contains: "project" } }),
        (filters) => {
          expect(filters.filter).toBe(undefined);
          done();
        },
      ]);

      await promises[0];
      spectator.detectChanges();
      filterProjects("project");
      await promises[1];
      spectator.detectChanges();
      filterProjects("");
      await promises[2];
      spectator.detectChanges();
    });

    it("should reset current page number", async (done) => {
      spectator.component["page"] = 5;

      const { promises } = promiseMultipleRequests(2, [
        (filters) => expect(filters.paging.page).toBe(5),
        (filters) => {
          expect(filters.paging.page).toBe(1);
          done();
        },
      ]);

      await promises[0];
      spectator.detectChanges();
      filterProjects("project");
      await promises[1];
      spectator.detectChanges();
    });

    it("should override project cards", async () => {
      spectator.component["page"] = 5;
      const { promises, requests } = promiseMultipleRequests(2);

      await promises[0];
      spectator.detectChanges();
      filterProjects("project");
      await promises[1];
      spectator.detectChanges();

      expect(spectator.component.cardList.toArray()).toEqual(
        List(requests[1].projects.map((project) => project.getCard())).toArray()
      );
    });
  });
});
