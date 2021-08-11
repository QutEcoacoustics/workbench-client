import {
  ApiErrorDetails,
  isApiErrorDetails,
} from "@baw-api/api.interceptor.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SiteComponent } from "@components/sites/site/site.component";
import { Errorable } from "@helpers/advancedTypes";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { MockComponent } from "ng-mocks";
import { SiteDetailsComponent } from "./site.component";

const mockSiteComponent = MockComponent(SiteComponent);

describe("SiteDetailsComponent", () => {
  let defaultError: ApiErrorDetails;
  let defaultProject: Project;
  let defaultSite: Site;
  let spec: SpectatorRouting<SiteDetailsComponent>;
  const createComponent = createRoutingFactory({
    declarations: [mockSiteComponent],
    component: SiteDetailsComponent,
  });

  function setup(project: Errorable<Project>, site: Errorable<Site>) {
    function getResolvedModel<T>(model: Errorable<T>): ResolvedModel<T> {
      return isApiErrorDetails(model) ? { error: model } : { model };
    }

    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: "resolver", site: "resolver" },
        project: getResolvedModel(project),
        site: getResolvedModel(site),
      },
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
    defaultError = generateApiErrorDetails();
  });

  it("should create", () => {
    setup(defaultProject, defaultSite);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should handle failure to retrieve project", () => {
    setup(defaultError, defaultSite);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  it("should handle failure to retrieve site", () => {
    setup(defaultProject, defaultError);
    spec.detectChanges();
    assertErrorHandler(spec.fixture);
  });

  it("should create site details component", () => {
    setup(defaultProject, defaultSite);
    spec.detectChanges();
    const { project, region, site } = spec.query(mockSiteComponent);
    expect(project).toEqual(defaultProject);
    expect(region).toBeFalsy();
    expect(site).toEqual(defaultSite);
  });
});
