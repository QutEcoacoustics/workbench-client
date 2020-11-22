import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  destroyGoogleMaps,
  embedGoogleMaps,
} from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { testFormlyFields } from "@test/helpers/formly";
import { assertErrorHandler } from "@test/helpers/html";
import { testFormImports } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { fields } from "../../site.base.json";
import { SiteNewComponent } from "./site.component";

describe("SiteNewComponent", () => {
  let spectator: SpectatorRouting<SiteNewComponent>;
  const createComponent = createRoutingFactory({
    component: SiteNewComponent,
    imports: [...testFormImports, MockBawApiModule],
    declarations: [FormComponent],
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
    let api: SpyObject<SitesService>;
    let defaultProject: Project;

    function setup(error?: ApiErrorDetails) {
      spectator = createComponent({
        detectChanges: false,
        params: { projectId: defaultProject?.id },
        data: {
          resolvers: { project: projectResolvers.show },
          project: { model: defaultProject, error },
        },
      });

      api = spectator.inject(SitesService);
      spectator.detectChanges();
    }

    beforeAll(async () => await embedGoogleMaps());
    afterAll(() => destroyGoogleMaps());
    beforeEach(() => {
      defaultProject = new Project(generateProject());
    });

    it("should create", () => {
      setup();
      expect(spectator.component).toBeTruthy();
    });

    it("should handle project error", () => {
      setup(generateApiErrorDetails());
      assertErrorHandler(spectator.fixture);
    });

    it("should call api", () => {
      setup();
      const site = new Site(generateSite());
      api.create.and.callFake(() => new Subject());

      spectator.component.submit({ ...site });
      expect(api.create).toHaveBeenCalledWith(
        new Site({ ...site }),
        defaultProject
      );
    });

    it("should redirect to site", () => {
      setup();
      const site = new Site(generateSite());
      api.create.and.callFake(() => new BehaviorSubject<Site>(site));

      spectator.component.submit({});
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        site.getViewUrl(defaultProject)
      );
    });
  });
});
