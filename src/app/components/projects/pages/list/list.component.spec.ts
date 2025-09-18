import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { IProject, Project } from "@models/Project";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { Subject } from "rxjs";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { MockComponent } from "ng-mocks";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { ProjectListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let api: SpyObject<ProjectsService>;
  let spec: Spectator<ProjectListComponent>;

  const createComponent = createRoutingFactory({
    component: ProjectListComponent,
    imports: [MockComponent(CardsComponent)],
    providers: [provideMockBawApi()],
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
      isBawApiError(models)
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
    return getCardsComponent().models();
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ProjectsService);
  });

  assertPageInfo(ProjectListComponent, ["Projects", shallowRegionsMenuItem.label]);

  it("should initially request page 1", async () => {
    await handleApiRequest([], (filter) => expect(filter.paging.page).toBe(1));
  });

  it("should handle failed projects model", async () => {
    await handleApiRequest(generateBawApiError());
    assertErrorHandler(spec.fixture, true);
  });

  describe("projects", () => {
    function assertCard(index: number, model: Project) {
      expect(getCards().get(index)).toBe(model);
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

    it("should display single project card", async () => {
      const projects = generateProjects(1);
      await handleApiRequest(projects);
      assertCard(0, projects[0]);
    });

    it("should display multiple project cards", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getCards().size).toBe(3);
    });

    it("should display multiple project cards in order", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      projects.forEach((project, index) => assertCard(index, project));
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
    function getFilterInput(): HTMLInputElement {
      return spec.query("input[type='text']");
    }

    function getInputDirective() {
      return spec.query(DebouncedInputDirective);
    }

    it("should have filtering option", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      expect(getFilterInput()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spec.component.filter = "custom value";
      spec.detectChanges();
      expect(getFilterInput()["value"]).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      const projects = generateProjects(3);
      await handleApiRequest(projects);
      spyOn(spec.component, "onFilter").and.stub();
      getInputDirective().valueChange.emit("custom value");
      expect(spec.component.onFilter).toHaveBeenCalled();
    });
  });
});
