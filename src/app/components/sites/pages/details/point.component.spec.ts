import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { SiteComponent } from "@components/sites/site/site.component";
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
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spectator: SpectatorRouting<PointDetailsComponent>;
  const createComponent = createRoutingFactory({
    declarations: [mockSiteComponent],
    component: PointDetailsComponent,
  });

  function setup(
    project: Project,
    region: Region,
    site: Site,
    projectError?: ApiErrorDetails,
    regionError?: ApiErrorDetails,
    siteError?: ApiErrorDetails
  ) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          project: projectResolvers.show,
          region: regionResolvers.show,
          site: siteResolvers.show,
        },
        project: { model: project, error: projectError },
        region: { model: region, error: regionError },
        site: { model: site, error: siteError },
      },
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
  });

  it("should create", () => {
    setup(defaultProject, defaultRegion, defaultSite);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should handle failure to retrieve project", () => {
    setup(undefined, defaultRegion, defaultSite, generateApiErrorDetails());
    spectator.detectChanges();
    assertErrorHandler(spectator.fixture);
  });

  it("should handle failure to retrieve region", () => {
    setup(
      defaultProject,
      undefined,
      defaultSite,
      undefined,
      generateApiErrorDetails()
    );
    spectator.detectChanges();
    assertErrorHandler(spectator.fixture);
  });

  it("should handle failure to retrieve site", () => {
    setup(
      defaultProject,
      defaultRegion,
      undefined,
      undefined,
      undefined,
      generateApiErrorDetails()
    );
    spectator.detectChanges();
    assertErrorHandler(spectator.fixture);
  });

  it("should create site details component", () => {
    setup(defaultProject, defaultRegion, defaultSite);
    spectator.detectChanges();
    const siteDetails = spectator.query(mockSiteComponent);
    expect(siteDetails).toBeTruthy();
    expect(siteDetails.project).toEqual(defaultProject);
    expect(siteDetails.region).toEqual(defaultRegion);
    expect(siteDetails.site).toEqual(defaultSite);
  });
});
