import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertErrorHandler } from "@test/helpers/html";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { SiteDeleteComponent } from "./delete.component";

describe("SiteDeleteComponent", () => {
  let api: SpyObject<SitesService>;
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spec: SpectatorRouting<SiteDeleteComponent>;
  const createComponent = createRoutingFactory({
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    component: SiteDeleteComponent,
    stubsEnabled: true,
  });

  function setup(
    project: Errorable<Project>,
    site: Errorable<Site>,
    region?: Errorable<Region>
  ) {
    function getResolvedModel<T>(model: Errorable<T>): ResolvedModel<T> {
      return isBawApiError(model) ? { error: model } : { model };
    }

    const resolvedModels = {
      project: getResolvedModel(project),
      site: getResolvedModel(site),
    };

    const resolvers = {
      project: "resolver",
      site: "resolver",
    };

    if (region) {
      resolvedModels["region"] = getResolvedModel(region);
      resolvers["region"] = "resolver";
    }

    spec = createComponent({
      detectChanges: false,
      data: { resolvers, ...resolvedModels },
    });

    api = spec.inject(SitesService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
  });

  describe("form", () => {
    it("should have no fields", () => {
      setup(defaultProject, defaultSite);
      expect(spec.component.fields).toEqual([]);
    });
  });

  describe("component", () => {
    [false, true].forEach((withRegion) => {
      describe(withRegion ? "withRegion" : "withoutRegion", () => {
        beforeEach(() => {
          defaultRegion = withRegion ? new Region(generateRegion()) : undefined;
        });

        it("should create", () => {
          setup(defaultProject, defaultSite, defaultRegion);
          expect(spec.component).toBeTruthy();
        });

        it("should handle project error", () => {
          setup(generateBawApiError(), defaultSite, defaultRegion);
          assertErrorHandler(spec.fixture);
        });

        if (withRegion) {
          it("should handle region error", () => {
            setup(defaultProject, defaultSite, generateBawApiError());
            assertErrorHandler(spec.fixture);
          });
        }

        it("should handle site error", () => {
          setup(defaultProject, generateBawApiError(), defaultRegion);
          assertErrorHandler(spec.fixture);
        });

        it("should call api", () => {
          setup(defaultProject, defaultSite, defaultRegion);
          api.destroy.and.callFake(() => new Subject());
          spec.component.submit({ ...defaultSite });
          expect(api.destroy).toHaveBeenCalledWith(
            new Site(defaultSite),
            defaultProject
          );
        });

        it(`should redirect to ${withRegion ? "region" : "project"}`, () => {
          const spy = spyOnProperty(
            withRegion ? defaultRegion : defaultProject,
            "viewUrl"
          );
          setup(defaultProject, defaultSite, defaultRegion);
          api.destroy.and.callFake(() => new BehaviorSubject<void>(null));

          spec.component.submit({});
          expect(spy).toHaveBeenCalled();
        });
      });
    });
  });
});
