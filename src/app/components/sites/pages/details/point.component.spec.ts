import {
  ApiErrorDetails,
  isApiErrorDetails,
} from "@baw-api/api.interceptor.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SiteComponent } from "@components/sites/components/site/site.component";
import { Errorable } from "@helpers/advancedTypes";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { MockComponent } from "ng-mocks";
import { PointDetailsComponent } from "./point.component";

const mockSiteComponent = MockComponent(SiteComponent);

describe("PointDetailsComponent", () => {
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spec: SpectatorRouting<PointDetailsComponent>;
  const createComponent = createRoutingFactory({
    declarations: [mockSiteComponent],
    component: PointDetailsComponent,
  });

  function setup(
    project: Errorable<Project>,
    region: Errorable<Region>,
    site: Errorable<Site>
  ) {
    function getResolvedModel<T>(model: Errorable<T>): ResolvedModel<T> {
      return isApiErrorDetails(model) ? { error: model } : { model };
    }

    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: "resolver",
          region: "resolver",
          site: "resolver",
        },
        project: getResolvedModel(project),
        region: getResolvedModel(region),
        site: getResolvedModel(site),
      },
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
    defaultError = generateApiErrorDetails();
  });

  it("should create", () => {
    setup(defaultProject, defaultRegion, defaultSite);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should handle failure to retrieve project", () => {
    setup(defaultError, defaultRegion, defaultSite);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  it("should handle failure to retrieve region", () => {
    setup(defaultProject, defaultError, defaultSite);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  it("should handle failure to retrieve site", () => {
    setup(defaultProject, defaultRegion, defaultError);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  it("should create site details component", () => {
    setup(defaultProject, defaultRegion, defaultSite);
    spec.detectChanges();
    const { project, region, site } = spec.query(mockSiteComponent);
    expect(project).toEqual(defaultProject);
    expect(region).toEqual(defaultRegion);
    expect(site).toEqual(defaultSite);
  });
});
