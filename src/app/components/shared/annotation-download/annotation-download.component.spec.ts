import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { PageInfo } from "@helpers/page/pageInfo";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { testFormImports } from "@test/helpers/testbed";
import { AnnotationDownloadComponent } from "./annotation-download.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

describe("AnnotationDownloadComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let siteApi: SpyObject<SitesService>;
  let spec: Spectator<AnnotationDownloadComponent>;
  const createComponent = createComponentFactory({
    component: AnnotationDownloadComponent,
    imports: [...testFormImports, MockBawApiModule, SharedModule],
  });

  function getHeader(): HTMLDivElement {
    return spec.query(".modal-header");
  }

  function getBody(): HTMLDivElement {
    return spec.query(".modal-body");
  }

  function getFooter(): HTMLDivElement {
    return spec.query(".modal-footer");
  }

  function setup(
    modelList: string[],
    models: (AbstractModel | ApiErrorDetails)[]
  ) {
    spec = createComponent({ detectChanges: false });
    siteApi = spec.inject(SitesService);

    const resolvers = {};
    const resolvedModels = {};
    modelList.forEach((resolver, index) => {
      resolvers[resolver] = "resolver";
      resolvedModels[resolver] =
        models[index] instanceof AbstractModel
          ? ({ model: models[index] } as ResolvedModel)
          : ({ error: models[index] } as ResolvedModel);
    });
    spec.component.routeData = { resolvers, ...resolvedModels } as PageInfo;
    spec.component.dismissModal = jasmine.createSpy("dismissModal").and.stub();
    spec.component.closeModal = jasmine.createSpy("closeModal").and.stub();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
  });

  it("should have annotations download in header", () => {
    setup([projectKey, siteKey], [defaultProject, defaultSite]);
    spec.detectChanges();
    expect(getHeader()).toContainText("Annotations Download");
  });

  describe("close button", () => {
    function getCloseButton() {
      return getHeader().querySelector("button");
    }

    it("should display in header", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      expect(getCloseButton()).toBeTruthy();
    });

    it("should display a close icon", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      expect(getCloseButton()).toHaveClass("btn-close");
    });

    it("should dismiss component", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      getCloseButton().click();
      spec.detectChanges();
      expect(spec.component.dismissModal).toHaveBeenCalled();
    });
  });

  describe("sub title", () => {
    it("should contain sub title", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      expect(getBody()).toHaveText("The annotations in the CSV will have");
    });

    it("should not refer to sites if region is defined", () => {
      setup(
        [projectKey, regionKey, siteKey],
        [defaultProject, defaultRegion, defaultSite]
      );
      spec.detectChanges();
      expect(getBody()).toHaveText(" point");
      expect(getBody()).not.toHaveText(" site");
    });

    it("should not refer to points if region is not defined", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      expect(getBody()).toHaveText(" site");
      expect(getBody()).not.toHaveText(" point");
    });
  });

  describe("form", () => {
    let siteWithoutTimezone: Site;

    beforeEach(
      () =>
        (siteWithoutTimezone = new Site({
          ...generateSite(),
          timezoneInformation: undefined,
          tzinfoTz: undefined,
        }))
    );

    it("should have timezone input", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      expect(spec.component.fields[0].type).toBe("timezone");
    });

    it("should default to UTC if no timezone exists for site", () => {
      setup([projectKey, siteKey], [defaultProject, siteWithoutTimezone]);
      spec.detectChanges();
      expect(spec.component.model.timezone).toBe("UTC");
    });

    it("should update with timezone for site", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      expect(spec.component.model.timezone).toBe(defaultSite.tzinfoTz);
    });
  });

  describe("submission", () => {
    function getSubmitButton() {
      return getFooter().querySelector("a");
    }

    it("submit button should be a href pointing to downloadAnnotations", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      siteApi.downloadAnnotations.andCallFake(
        () => "http://www.broken.com/broken_link"
      );
      spec.detectChanges();
      expect(getSubmitButton().href).toBe("http://www.broken.com/broken_link");
    });

    it("should call downloadAnnotations with site and project", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      // Button href will call this function on load
      expect(siteApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultSite,
        defaultProject,
        spec.component.model.timezone
      );
    });

    it("should call downloadAnnotations with site and regions project if region exists", () => {
      setup(
        [projectKey, regionKey, siteKey],
        [defaultProject, defaultRegion, defaultSite]
      );
      spec.detectChanges();
      // Button href will call this function on load
      expect(siteApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultSite,
        defaultRegion.projectId,
        spec.component.model.timezone
      );
    });

    it("should call downloadAnnotations with timezone", () => {
      setup(
        [projectKey, regionKey, siteKey],
        [defaultProject, defaultRegion, defaultSite]
      );
      spec.detectChanges();
      spec.component.model.timezone = "Australia/Brisbane";
      spec.detectChanges();
      // Button href will call this function on load
      expect(siteApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultSite,
        defaultRegion.projectId,
        "Australia/Brisbane"
      );
    });
  });
});
