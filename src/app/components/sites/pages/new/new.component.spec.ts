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
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FormComponent } from "@shared/form/form.component";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports } from "@test/helpers/testbed";
import { ToastsService } from "@services/toasts/toasts.service";
import { BehaviorSubject, Subject } from "rxjs";
import { MockComponent } from "ng-mocks";
import { MapComponent } from "@shared/map/map.component";
import pointSchema from "../../point.base.json";
import siteSchema from "../../site.base.json";
import { SiteNewComponent } from "./new.component";

describe("SiteNewComponent", () => {
  let spec: SpectatorRouting<SiteNewComponent>;
  const createComponent = createRoutingFactory({
    component: SiteNewComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent, MockComponent(MapComponent)],
    mocks: [ToastsService],
  });

  // Only sites with regions have their own page, normal sites are part of a wizard
  assertPageInfo(SiteNewComponent, "New Point");

  describe("form", () => {
    [true, false].forEach((withRegion) => {
      describe(withRegion ? "withRegion" : "withoutRegion", () => {
        const fields: FormlyFieldConfig[] = withRegion
          ? pointSchema.fields
          : siteSchema.fields;
        const modelName = withRegion ? "Point" : "Site";

        testFormlyFields([
          {
            testGroup: `${modelName} Name Input`,
            field: fields[1],
            key: "name",
            type: "input",
            required: true,
            label: `${modelName} Name`,
            inputType: "text",
          },
          {
            testGroup: `${modelName} Description Input`,
            field: fields[2],
            key: "description",
            type: "textarea",
            label: "Description",
          },
          {
            testGroup: `${modelName} Location Input`,
            field: fields[4],
            key: "location",
            label: "Location",
          },
          {
            testGroup: `${modelName} Image Input`,
            field: fields[10],
            key: "image",
            type: "image",
            label: "Image Upload",
          },
        ]);
      });
    });
  });

  describe("component", () => {
    let api: SpyObject<SitesService>;
    let defaultProject: Project;
    let defaultRegion: Region;

    function setup(project: Project, region?: Region) {
      const resolvers = { project: "resolver" };
      const models = { project: { model: project } };

      if (region) {
        resolvers["region"] = "resolver";
        models["region"] = { model: region };
      }

      spec = createComponent({
        detectChanges: false,
        data: { resolvers, ...models },
      });

      api = spec.inject(SitesService);
      spec.detectChanges();
    }

    beforeEach(() => {
      defaultProject = new Project(generateProject());
    });

    [true, false].forEach((withRegion) => {
      describe(withRegion ? "withRegion" : "withoutRegion", () => {
        beforeEach(() => {
          if (withRegion) {
            defaultRegion = new Region(generateRegion());
          }
        });

        it("should create", () => {
          setup(defaultProject, defaultRegion);
          expect(spec.component).toBeTruthy();
        });

        it("should call api", () => {
          setup(defaultProject, defaultRegion);
          api.create.and.callFake(() => new Subject());
          const site = new Site(
            generateSite(withRegion ? { regionId: defaultRegion.id } : {})
          );

          spec.component.submit({ ...site });
          expect(api.create).toHaveBeenCalledWith(
            new Site({ ...site }),
            defaultProject
          );
        });

        it("should contain the region and project id in the api calls site model", () => {
          setup(defaultProject, defaultRegion);
          api.create.and.callFake(() => new Subject());
          const site = new Site(
            generateSite(withRegion ? { regionId: defaultRegion.id } : {})
          );

          spec.component.submit({ ...site });

          const expectedSiteModel = new Site({
            ...site,
            projectIds: [defaultProject.id],
            regionId: withRegion ? defaultRegion.id : undefined,
          });

          expect(api.create).toHaveBeenCalledWith(
            expectedSiteModel,
            defaultProject
          );
        });

        it("should redirect to site", () => {
          setup(defaultProject, defaultRegion);
          const site = new Site(
            generateSite(withRegion ? { regionId: defaultRegion.id } : {})
          );
          api.create.and.callFake(() => new BehaviorSubject<Site>(site));

          spec.component.submit({});
          expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
            site.getViewUrl(defaultProject)
          );
        });
      });
    });
  });
});
