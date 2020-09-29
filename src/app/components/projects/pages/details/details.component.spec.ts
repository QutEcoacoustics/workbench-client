import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import { RegionCardsComponent } from "@components/projects/region-cards/region-cards.component";
import { SiteCardsComponent } from "@components/projects/site-cards/site-cards.component";
import { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { assetRoot } from "@services/app-config/app-config.service";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler, assertImage } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { DetailsComponent } from "./details.component";

const mockComponents = {
  SiteCards: MockComponent(SiteCardsComponent),
  RegionCards: MockComponent(RegionCardsComponent),
};

describe("ProjectDetailsComponent", () => {
  let api: SpyObject<SitesService>;
  let spectator: SpectatorRouting<DetailsComponent>;
  const createComponent = createRoutingFactory({
    component: DetailsComponent,
    declarations: [mockComponents.SiteCards, mockComponents.RegionCards],
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  function setup(model: Project, error?: ApiErrorDetails) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: projectResolvers.show },
        project: { model, error },
      },
    });

    api = spectator.inject(SitesService);
  }

  async function handleApiRequest(
    models: Site[],
    error?: ApiErrorDetails,
    assertFilter: (filters: Filters<ISite>) => void = () => {}
  ) {
    const subject = new Subject<Site[]>();
    const promise = nStepObservable(subject, () => models ?? error, !models);
    api.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
  }

  describe("Error Handling", () => {
    it("should handle failed project model", async () => {
      setup(undefined, generateApiErrorDetails());
      await handleApiRequest([]);
      spectator.detectChanges();
      assertErrorHandler(spectator.fixture);
    });
  });

  describe("Project", () => {
    it("should display project name", async () => {
      const project = new Project(generateProject());
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const title = spectator.query<HTMLHeadingElement>("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toBe(project.name);
    });

    it("should display default project image", async () => {
      const project = new Project({
        ...generateProject(),
        imageUrl: undefined,
      });
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const image = spectator.query<HTMLImageElement>("img");
      assertImage(
        image,
        `${websiteHttpUrl}${assetRoot}/images/project/project_span4.png`,
        project.name + " image"
      );
    });

    it("should display custom project image", async () => {
      const project = new Project({
        ...generateProject(),
        imageUrl: "http://brokenlink/",
      });
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const image = spectator.query<HTMLImageElement>("img");
      assertImage(image, "http://brokenlink/", project.name + " image");
    });

    it("should display description with html markup", async () => {
      const project = new Project({
        ...generateProject(),
        descriptionHtml: "<b>A test project</b>",
      });
      setup(project);
      await handleApiRequest([]);
      spectator.detectChanges();

      const description = spectator.query("p#project_description");
      expect(description).toBeTruthy();
      expect(description.innerHTML).toBe("<b>A test project</b>");
    });
  });
});
