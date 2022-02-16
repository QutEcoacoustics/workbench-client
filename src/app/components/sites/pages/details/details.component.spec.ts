import { ResolvedModel } from "@baw-api/resolver-common";
import { SiteComponent } from "@components/sites/components/site/site.component";
import { Errorable } from "@helpers/advancedTypes";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { MockComponent } from "ng-mocks";
import { Region } from "@models/Region";
import { generateRegion } from "@test/fakes/Region";
import {
  BawApiError,
  isBawApiError,
} from "@helpers/custom-errors/baw-api-error";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { SiteDetailsComponent } from "./details.component";

const mockSiteComponent = MockComponent(SiteComponent);

describe("SiteDetailsComponent", () => {
  let defaultError: BawApiError;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spec: SpectatorRouting<SiteDetailsComponent>;
  const createComponent = createRoutingFactory({
    declarations: [mockSiteComponent],
    component: SiteDetailsComponent,
  });

  function setup(
    project: Errorable<Project>,
    site: Errorable<Site>,
    region?: Errorable<Region>
  ) {
    function getResolvedModel<T>(model: Errorable<T>): ResolvedModel<T> {
      return isBawApiError(model) ? { error: model } : { model };
    }

    const models = {
      project: getResolvedModel(project),
      site: getResolvedModel(site),
    };
    const resolvers = { project: "resolver", site: "resolver" };

    if (region) {
      models["region"] = getResolvedModel(region);
      resolvers["region"] = "resolver";
    }

    spec = createComponent({
      detectChanges: false,
      data: { resolvers, ...models },
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
    defaultError = generateBawApiError();
  });

  [true, false].forEach((withRegion) => {
    describe(withRegion ? "withRegion" : "withoutRegion", () => {
      beforeEach(() => {
        defaultRegion = withRegion ? new Region(generateRegion()) : undefined;
      });

      it("should create", () => {
        setup(defaultProject, defaultSite, defaultRegion);
        spec.detectChanges();
        expect(spec.component).toBeTruthy();
      });

      it("should handle failure to retrieve project", () => {
        setup(defaultError, defaultSite, defaultRegion);
        spec.detectChanges();
        assertErrorHandler(spec.fixture);
      });

      if (withRegion) {
        it("should handle failure to retrieve region", () => {
          setup(defaultProject, defaultSite, defaultError);
          spec.detectChanges();
          assertErrorHandler(spec.fixture);
        });
      }

      it("should handle failure to retrieve site", () => {
        setup(defaultProject, defaultError, defaultRegion);
        spec.detectChanges();
        assertErrorHandler(spec.fixture);
      });

      it("should create site details component", () => {
        setup(defaultProject, defaultSite, defaultRegion);
        spec.detectChanges();
        const { project, region, site } = spec.query(mockSiteComponent);
        expect(project).toEqual(defaultProject);
        expect(region).toEqual(defaultRegion);
        expect(site).toEqual(defaultSite);
      });
    });
  });
});
