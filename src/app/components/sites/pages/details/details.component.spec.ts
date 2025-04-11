import { ResolvedModel } from "@baw-api/resolver-common";
import { SiteComponent } from "@components/sites/components/site/site.component";
import { Errorable } from "@helpers/advancedTypes";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting, SpyObject } from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { MockComponent } from "ng-mocks";
import { Region } from "@models/Region";
import { generateRegion } from "@test/fakes/Region";
import { BawApiError, isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { ToastService } from "@services/toasts/toasts.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { SitesService } from "@baw-api/site/sites.service";
import { ConfigService } from "@services/config/config.service";
import { PageTitleStrategy } from "src/app/app.component";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { SiteDetailsComponent } from "./details.component";

const mockSiteComponent = MockComponent(SiteComponent);

describe("SiteDetailsComponent", () => {
  let defaultError: BawApiError;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let sitesApi: SpyObject<SitesService>;
  let routerSpy: SpyObject<Router>;
  let configService: SpyObject<ConfigService>;
  let spec: SpectatorRouting<SiteDetailsComponent>;

  const createComponent = createRoutingFactory({
    imports: [SharedModule, MockBawApiModule],
    providers: [PageTitleStrategy],
    declarations: [mockSiteComponent],
    mocks: [ToastService],
    component: SiteDetailsComponent,
  });

  function setup(project: Errorable<Project>, site: Errorable<Site>, region?: Errorable<Region>) {
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

    sitesApi = spec.inject(SitesService);
    routerSpy = spec.inject(Router);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultError = generateBawApiError();
  });

  // since sites and points use the same client model class, we can assert that both the site and point details page use the same title
  assertPageInfo<Site>(SiteDetailsComponent, "test name", {
    site: {
      model: new Site(generateSite({ name: "test name" })),
    },
  });

  [true, false].forEach((withRegion) => {
    describe(withRegion ? "withRegion" : "withoutRegion", () => {
      beforeEach(() => {
        defaultRegion = withRegion
          ? new Region(
              generateRegion({
                projectId: defaultProject.id,
              }),
            )
          : undefined;

        if (withRegion) {
          defaultSite = new Site(generateSite({ regionId: defaultRegion.id }));
        } else {
          defaultSite = new Site(generateSite());
        }
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
        const { project, region, site } = spec.query(SiteComponent);
        expect(project).toEqual(defaultProject);
        expect(region).toEqual(defaultRegion);
        expect(site).toEqual(defaultSite);
      });

      [false, true].forEach((projectsHidden: boolean) => {
        describe(`deleteModel ${projectsHidden ? "with" : "without"} projects hidden`, () => {
          beforeEach(() => {
            setup(defaultProject, defaultSite, defaultRegion);
            sitesApi.destroy.and.callFake(() => of(null));

            configService ||= spec.inject(ConfigService);
            configService.settings.hideProjects = projectsHidden;
          });
          afterEach(() => (configService.settings.hideProjects = false));

          it("should invoke the correct api calls when the deleteModel() method is called", () => {
            spec.detectChanges();
            spec.component.deleteModel();
            expect(sitesApi.destroy).toHaveBeenCalledWith(defaultSite, defaultProject);
          });

          it(`should navigate to ${withRegion ? "parent region" : projectsHidden ? "sites" : "projects"} page after success`, () => {
            const projectSubRoute = `/projects/${defaultProject.id}`;
            let expectedRoute: string;

            if (withRegion) {
              expectedRoute = `${projectSubRoute}/regions/${defaultRegion.id}`;
            } else {
              if (projectsHidden) {
                expectedRoute = "/regions";
              } else {
                expectedRoute = projectSubRoute;
              }
            }

            spec.detectChanges();

            spec.component.deleteModel();

            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
          });
        });
      });
    });
  });
});
