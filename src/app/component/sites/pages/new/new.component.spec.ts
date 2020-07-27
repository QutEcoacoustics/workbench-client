import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { testBawServices, testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { fields } from "../../site.base.json";
import { NewComponent } from "./new.component";

describe("SitesNewComponent", () => {
  let api: SitesService;
  let defaultProject: Project;
  let defaultError: ApiErrorDetails;
  let spectator: SpectatorRouting<NewComponent>;
  let createComponent = createRoutingFactory({
    component: NewComponent,
    imports: testFormImports,
    declarations: [FormComponent],
    providers: testBawServices,
    mocks: [ToastrService],
    stubsEnabled: true,
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Site Name Input",
        field: fields[1],
        key: "name",
        type: "input",
        required: true,
        label: "Site Name",
        inputType: "text",
      },
      {
        testGroup: "Site Description Input",
        field: fields[2],
        key: "description",
        type: "textarea",
        label: "Description",
      },
      {
        testGroup: "Site Location Input",
        field: fields[4],
        key: "location",
        label: "Location",
      },
      {
        testGroup: "Site Image Input",
        field: fields[9],
        key: "imageUrl",
        type: "image",
        label: "Image",
      },
    ]);
  });

  describe("component", () => {
    function setup(model: Project, error?: ApiErrorDetails) {
      spectator = createComponent({
        detectChanges: false,
        params: { projectId: model?.id },
        data: {
          resolvers: { project: projectResolvers.show },
          project: { model, error },
        },
      });

      api = spectator.inject(SitesService);
      spectator.detectChanges();
    }

    beforeAll(async () => await embedGoogleMaps());
    beforeEach(() => {
      defaultProject = new Project(generateProject());
      defaultError = { status: 401, message: "Unauthorized" };
    });
    afterAll(() => destroyGoogleMaps());

    it("should create", () => {
      setup(defaultProject);

      expect(spectator.component).toBeTruthy();
    });

    it("should handle project error", () => {
      setup(undefined, defaultError);
      assertResolverErrorHandling(spectator.fixture);
    });

    it("should call api", () => {
      setup(defaultProject);
      spyOn(api, "create").and.callThrough();

      spectator.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });

    it("should redirect to site", () => {
      setup(defaultProject);
      const site = new Site(generateSite());
      spyOn(site, "getViewUrl").and.stub();
      spyOn(api, "create").and.callFake(() => new BehaviorSubject<Site>(site));

      spectator.component.submit({});
      expect(site.getViewUrl).toHaveBeenCalledWith(defaultProject);
    });
  });
});
