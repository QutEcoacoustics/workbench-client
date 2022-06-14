import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
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
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import pointSchema from "../../point.schema.json";
import siteSchema from "../../site.schema.json";
import { SiteNewComponent } from "./new.component";

describe("SiteNewComponent", () => {
  let spec: SpectatorRouting<SiteNewComponent>;
  const createComponent = createRoutingFactory({
    component: SiteNewComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
    mocks: [ToastrService],
    stubsEnabled: true,
  });

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

  // TODO Disabled because of #1338
  xdescribe("component", () => {
    let api: SpyObject<SitesService>;
    let defaultProject: Project;
    let defaultRegion: Region;

    function setup(project: Errorable<Project>, region?: Errorable<Region>) {
      function getResolvedModel<T>(model: Errorable<T>): ResolvedModel<T> {
        return isBawApiError(model) ? { error: model } : { model };
      }

      const resolvers = { project: "resolver", site: "resolver" };
      const models = {
        project: getResolvedModel(project),
      };

      if (region) {
        resolvers["region"] = "resolver";
        models["region"] = getResolvedModel(region);
      }

      spec = createComponent({
        detectChanges: false,
        data: { resolvers, ...models },
      });

      api = spec.inject(SitesService);
      spec.detectChanges();
    }

    beforeAll(async () => await embedGoogleMaps());
    afterAll(() => destroyGoogleMaps());

    [true, false].forEach((withRegion) => {
      xdescribe(withRegion ? "withRegion" : "withoutRegion", () => {
        beforeEach(() => {
          defaultProject = new Project(generateProject());
          defaultRegion = withRegion ? new Region(generateRegion()) : undefined;
        });

        it("should create", () => {
          setup(defaultProject, defaultRegion);
          expect(spec.component).toBeTruthy();
        });

        if (withRegion) {
          it("should handle region error", () => {
            setup(defaultProject, generateBawApiError());
            assertErrorHandler(spec.fixture);
          });
        }

        it("should handle project error", () => {
          setup(generateBawApiError(), defaultRegion);
          assertErrorHandler(spec.fixture);
        });

        // TODO Validate region id is set in api call
        it("should call api", () => {
          setup(defaultProject, defaultRegion);
          api.update.and.callFake(() => new Subject());
          const site = new Site(
            generateSite(withRegion ? { regionId: defaultRegion.id } : {})
          );

          spec.component.submit({ ...site });
          expect(api.create).toHaveBeenCalledWith(
            new Site({ ...site }),
            defaultProject
          );
        });

        it("should redirect to site", () => {
          setup(defaultProject, defaultRegion);
          const site = new Site(
            generateSite(withRegion ? { regionId: defaultRegion.id } : {})
          );
          api.update.and.callFake(() => new BehaviorSubject<Site>(site));

          spec.component.submit({});
          expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
            site.getViewUrl(defaultProject)
          );
        });
      });
    });
  });
});
