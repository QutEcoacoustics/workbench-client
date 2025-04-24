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
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FormComponent } from "@shared/form/form.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { BehaviorSubject, Subject } from "rxjs";
import { MockComponent } from "ng-mocks";
import { MapComponent } from "@shared/map/map.component";
import pointSchema from "../../point.base.json";
import siteSchema from "../../site.base.json";
import { SiteEditComponent } from "./edit.component";

describe("SiteEditComponent", () => {
  let spec: SpectatorRouting<SiteEditComponent>;

  const createComponent = createRoutingFactory({
    component: SiteEditComponent,
    imports: testFormImports,
    providers: testFormProviders,
    declarations: [FormComponent, MockComponent(MapComponent)],
    mocks: [ToastService],
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

  describe("component", () => {
    let api: SpyObject<SitesService>;
    let defaultProject: Project;
    let defaultRegion: Region;
    let defaultSite: Site;

    assertPageInfo(SiteEditComponent, "Edit");

    function setup(
      project: Errorable<Project>,
      site: Errorable<Site>,
      region?: Errorable<Region>
    ) {
      function getResolvedModel<T>(model: Errorable<T>): ResolvedModel<T> {
        return isBawApiError(model) ? { error: model } : { model };
      }

      const resolvers = { project: "resolver", site: "resolver" };
      const models = {
        project: getResolvedModel(project),
        site: getResolvedModel(site),
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

    const longitudeInputElement = (): HTMLInputElement =>
      spec.query<HTMLInputElement>("#longitude");
    const latitudeInputElement = (): HTMLInputElement =>
      spec.query<HTMLInputElement>("#latitude");

    [true, false].forEach((withRegion) => {
      describe(withRegion ? "withRegion" : "withoutRegion", () => {
        beforeEach(() => {
          defaultProject = new Project(generateProject());
          defaultRegion = withRegion ? new Region(generateRegion()) : undefined;
          defaultSite = new Site(
            generateSite(withRegion ? { regionId: defaultRegion.id } : {})
          );
        });

        it("should create", () => {
          setup(defaultProject, defaultSite, defaultRegion);
          expect(spec.component).toBeTruthy();
        });

        it("should handle site error", () => {
          setup(defaultProject, generateBawApiError(), defaultRegion);
          assertErrorHandler(spec.fixture);
        });

        if (withRegion) {
          it("should handle region error", () => {
            setup(defaultProject, defaultSite, generateBawApiError());
            assertErrorHandler(spec.fixture);
          });
        }

        it("should handle project error", () => {
          setup(generateBawApiError(), defaultSite, defaultRegion);
          assertErrorHandler(spec.fixture);
        });

        // TODO Validate region id is set in api call
        it("should call api", () => {
          setup(defaultProject, defaultSite, defaultRegion);
          api.update.and.callFake(() => new Subject());

          spec.component.submit({ ...defaultSite });
          expect(api.update).toHaveBeenCalledWith(
            new Site({ ...defaultSite }),
            defaultProject
          );
        });

        it("should redirect to site", () => {
          setup(defaultProject, defaultSite, defaultRegion);
          const site = new Site(generateSite());
          api.update.and.callFake(() => new BehaviorSubject<Site>(site));

          spec.component.submit({});
          expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
            site.getViewUrl(defaultProject)
          );
        });

        it("should handle being modified to have a null location", () => {
          setup(defaultProject, defaultSite, defaultRegion);
          api.update.and.callFake(() => new Subject());

          // by setting longitude and latitude to empty strings, we should see the model set location properties to null
          const longitudeInput = longitudeInputElement();
          const latitudeInput = latitudeInputElement();

          spec.typeInElement("", longitudeInput);
          spec.typeInElement("", latitudeInput);
          spec.detectChanges();

          spec.component.submit(spec.component.model);
          expect(api.update).toHaveBeenCalledWith(
            jasmine.objectContaining({
              longitude: null,
              latitude: null,
            }),
            defaultProject
          );
        });
      });
    });
  });
});
