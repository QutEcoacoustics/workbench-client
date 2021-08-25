import { RouterTestingModule } from "@angular/router/testing";
import { isApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Errorable } from "@helpers/advancedTypes";
import { IProject, Project } from "@models/Project";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardsComponent } from "@shared/cards/cards.component";
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
  let spec: Spectator<ListComponent>;
  const createComponent = createComponentFactory({
    component: ListComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  function generateProjects(
    numRegions: number,
    overrides: IProject = {}
  ): Project[] {
    const projects = [];
    for (let i = 0; i < Math.min(numRegions, defaultApiPageSize); i++) {
      const project = new Project(generateProject(overrides));
      project.addMetadata({
        status: 200,
        message: "OK",
        paging: { total: numRegions },
      });
      projects.push(project);
    }
    return projects;
  }

  async function handleApiRequest(
    models: Errorable<Project[]>,
    assertFilter: (filters: Filters<Project>) => void = () => {}
  ) {
    const subject = new Subject<Project[]>();
    const promise = nStepObservable(
      subject,
      () => models,
      isApiErrorDetails(models)
    );
    api.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function getCardsComponent() {
    return spec.query(CardsComponent);
  }

  function getCards() {
    return getCardsComponent().cards;
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ProjectsService);
  });

  it("should initially request page 1", async () => {
    await handleApiRequest([], (filter) => expect(filter.paging.page).toBe(1));
  });

  it("should handle failed projects model", async () => {
    await handleApiRequest(generateApiErrorDetails());
    assertErrorHandler(spec.fixture, true);
  });

  it("should display loading animation during request", async () => {
    handleApiRequest([]);
    assertSpinner(spec.fixture, true);
  });

  it("should clear loading animation on response", async () => {
    await handleApiRequest([]);
    assertSpinner(spec.fixture, false);
  });

  describe("projects", () => {
    function assertCardTitle(index: number, title: string) {
      expect(getCards().get(index).title).toBe(title);
    }

    function assertCardDescription(index: number, desc: string) {
      expect(getCards().get(index).description).toBe(desc);
    }

    it("should handle zero projects", async () => {
      await handleApiRequest([]);
      const title = spec.query<HTMLHeadingElement>("h4");
      expect(title).toContainText("Your list of projects is empty");
      expect(getCardsComponent()).toBeFalsy();
    });

    it("should display single project card", async () => {
      await handleApiRequest(generateProjects(1));
      expect(getCards().size).toBe(1);
    });

    it("should display single project card with title", async () => {
      const projects = generateProjects(1);
      await handleApiRequest(projects);
      assertCardTitle(0, projects[0].name);
    });

    it("should display single project card with description", async () => {
      const projects = generateProjects(1, {
        descriptionHtmlTagline: "<b>Custom</b> Description",
      });
      await handleApiRequest(projects);
      assertCardDescription(0, projects[0].descriptionHtmlTagline);
    });

    it("should display multiple project cards", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getCards().size).toBe(3);
    });

    it("should display multiple project cards in order", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      projects.forEach((project, index) =>
        assertCardTitle(index, project.name)
      );
    });
  });

  describe("scrolling", () => {
    function getPagination() {
      return spec.query(NgbPagination);
    }

    function getPaginationLinks() {
      return spec.queryAll("ngb-pagination a");
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
      return spec.query(DebounceInputComponent);
    }

    it("should have filtering option", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getFilter()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spec.component.filter = "custom value";
      spec.detectChanges();
      expect(getFilter().default).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spyOn(spec.component, "onFilter").and.stub();
      getFilter().filter.next("custom value");
      expect(spec.component.onFilter).toHaveBeenCalled();
    });
  });
});
