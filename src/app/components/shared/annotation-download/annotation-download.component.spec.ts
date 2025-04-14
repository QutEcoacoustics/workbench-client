import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { Errorable } from "@helpers/advancedTypes";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { BehaviorSubject } from "rxjs";
import { ProjectsService } from "@baw-api/project/projects.service";
import { PROJECT, SITE } from "@baw-api/ServiceTokens";
import { AnnotationDownloadComponent } from "./annotation-download.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

describe("AnnotationDownloadComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let projectApi: SpyObject<ProjectsService>;
  let siteApi: SpyObject<SitesService>;
  let spec: Spectator<AnnotationDownloadComponent>;

  const createComponent = createComponentFactory({
    component: AnnotationDownloadComponent,
    imports: [...testFormImports, MockBawApiModule],
    providers: testFormProviders,
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

  function setup(modelList: string[], models: Errorable<AbstractModel>[]) {
    const resolvers = {};
    const resolvedModels = {};
    modelList.forEach((resolver, index) => {
      resolvers[resolver] = "resolver";
      resolvedModels[resolver] =
        models[index] instanceof AbstractModel
          ? ({ model: models[index] } as ResolvedModel)
          : ({ error: models[index] } as ResolvedModel);
    });

    spec = createComponent({
      detectChanges: false,
      providers: [
        mockProvider(SharedActivatedRouteService, {
          pageInfo: new BehaviorSubject({
            resolvers,
            ...resolvedModels,
          } as IPageInfo),
        }),
      ],
    });

    projectApi = spec.inject(PROJECT.token);
    siteApi = spec.inject(SITE.token);

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
        (siteWithoutTimezone = new Site(
          generateSite({ timezoneInformation: undefined, tzinfoTz: undefined })
        ))
    );

    it("should have timezone input", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      expect(spec.component.fields[0].type).toBe("timezone");
    });

    it("should default to UTC if no timezone exists for site", () => {
      setup([projectKey, siteKey], [defaultProject, siteWithoutTimezone]);
      spec.detectChanges();
      expect(spec.component.model.timezone).toBe("Etc/UTC");
    });

    it("should display the correct text for a UTC timezone", () => {
      setup([projectKey, siteKey], [defaultProject, siteWithoutTimezone]);
      spec.detectChanges();

      const shortZoneElement = getBody().querySelector(".input-group-text");
      expect(shortZoneElement).toHaveExactTrimmedText("UTC");
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

    it("should call the site downloadAnnotations api with site and project", () => {
      setup([projectKey, siteKey], [defaultProject, defaultSite]);
      spec.detectChanges();
      // Button href will call this function on load
      expect(siteApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultSite,
        defaultProject,
        spec.component.model.timezone
      );
    });

    it("should call the site downloadAnnotations api with site and regions project if region exists", () => {
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

    it("should call the projects api with the UTC timezone if there is no explicit timezone", () => {
      setup([projectKey], [defaultProject]);
      spec.detectChanges();

      expect(projectApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultProject,
        "UTC",
      );
    });

    // explicit timezones can be set by the user using the timezone dropdown
    // while this feature
    it("should call the projects api correctly if there is an explicit timezone", () => {
      const explicitTimezone = "Australia/Brisbane";
      setup([projectKey], [defaultProject]);
      spec.detectChanges();
      spec.component.model.timezone = explicitTimezone;
      spec.detectChanges();

      expect(projectApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultProject,
        explicitTimezone
      );
    });

    it("should call the site apis downloadAnnotations with timezone", () => {
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

    it("should not emit Etc in UTC timezone on submit", () => {
      setup(
        [projectKey, regionKey, siteKey],
        [defaultProject, defaultRegion, defaultSite]
      );
      spec.detectChanges();

      // because vvo/tzdb sets the timezone identifier of UTC to Etc/UTC we want to mock this behavior
      // however, we should see that the timezone sent to the api is UTC and not Etc/UTC
      spec.component.model.timezone = "Etc/UTC";
      spec.detectChanges();

      expect(siteApi.downloadAnnotations).toHaveBeenCalledWith(
        defaultSite,
        defaultRegion.projectId,
        "UTC"
      );
    });
  });
});
