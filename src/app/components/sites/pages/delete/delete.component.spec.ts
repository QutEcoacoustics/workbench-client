import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
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
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
    component: SiteDeleteComponent,
  });

  function setup(project: Project, site: Site, region?: Region) {
    const resolvedModels = {
      project: { model: project },
      site: { model: site },
    };

    const resolvers = { project: "resolver", site: "resolver" };

    if (region) {
      resolvedModels["region"] = { model: region };
      resolvers["region"] = "resolver";
    }

    spec = createComponent({
      data: { resolvers, ...resolvedModels },
      detectChanges: false,
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
