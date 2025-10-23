import { fakeAsync } from "@angular/core/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import {
  BawSessionService,
  guestAuthToken,
} from "@baw-api/baw-session.service";
import { Writeable } from "@helpers/advancedTypes";
import { AuthToken } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { provideMockConfig } from "@services/config/provide-configMock";
import { HiddenCopyComponent } from "@shared/hidden-copy/hidden-copy.component";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { MockComponent } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { DateTimeFilterComponent } from "@shared/date-time-filter/date-time-filter.component";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { IconsModule } from "@shared/icons/icons.module";
import { provideCaching } from "@services/cache/provide-caching";
import { SitesWithoutTimezonesComponent } from "../../components/sites-without-timezones/sites-without-timezones.component";
import { DownloadTableComponent } from "../../components/download-table/download-table.component";
import { DownloadAudioRecordingsComponent } from "./download.component";

describe("DownloadAudioRecordingsComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let api: AudioRecordingsService;
  let apiFilter: Subject<AudioRecording[]>;
  let spec: SpectatorRouting<DownloadAudioRecordingsComponent>;

  const createComponent = createRoutingFactory({
    component: DownloadAudioRecordingsComponent,
    imports: [
      IconsModule,

      NgbCollapse,
      DateTimeFilterComponent,
      MockComponent(SitesWithoutTimezonesComponent),
      MockComponent(DownloadTableComponent),
      MockComponent(WebsiteStatusWarningComponent),
    ],
    // We are relying on AudioRecordingsService's batchDownloadUrl so we will
    // mock out any API calls
    providers: [
      provideMockBawApi(),
      provideCaching(),
      mockProvider(ToastService),
      provideMockConfig(),
      BawSessionService,
      BawApiService,
      AudioRecordingsService,
    ],
  });

  const getProjectInput = () => spec.query<HTMLInputElement>("#project");
  const getRegionInput = () => spec.query<HTMLInputElement>("#region");
  const getSiteInput = () => spec.query<HTMLInputElement>("#site");
  const getSiteLabel = () => spec.query<HTMLLabelElement>("#site-label");
  const getDownloadLink = () =>
    spec.query<HTMLAnchorElement>("#download-script");

  function loadForm() {
    // Have to do this tick because of
    // https://github.com/angular/angular/issues/22606#issuecomment-377390233
    // Also because the observable which updates the filter has a debounce timer
    spec.tick(1000);
    spec.detectChanges();
  }

  function setup(
    project: Project,
    region?: Region,
    site?: Site,
    authToken?: AuthToken
  ) {
    const resolvers = {};
    const models = {};

    if (site) {
      resolvers["site"] = "resolver";
      models["site"] = { model: site };
    }
    if (region) {
      resolvers["region"] = "resolver";
      models["region"] = { model: region };
    }
    if (project) {
      resolvers["project"] = "resolver";
      models["project"] = { model: project };
    }

    spec = createComponent({
      data: { resolvers, ...models },
      detectChanges: false,
      providers: [
        mockProvider(BawSessionService, {
          authToken: authToken ?? guestAuthToken,
        }),
      ],
    });
    apiFilter = new Subject();
    api = spec.inject(AudioRecordingsService);
    spyOn(api, "filter").and.callFake(() => apiFilter);
    spyOn(api, "batchDownloadUrl").and.callThrough();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
  });

  describe("models", () => {
    describe("project", () => {
      it("should show project if exists", fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        expect(getProjectInput()).toHaveValue(defaultProject.name);
      }));

      it("should sort bulk download by projects", fakeAsync(() => {
        const expectedFilter: any = {
          filter: { "projects.id": { eq: defaultProject.id } },
        };
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        expect(getDownloadLink()).toHaveHref(
          api.batchDownloadUrl(expectedFilter)
        );
      }));
    });

    describe("region", () => {
      it("should not show region if not exists", fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        expect(getRegionInput()).toBeFalsy();
      }));

      it("should show region if exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion);
        spec.detectChanges();
        loadForm();
        expect(getRegionInput()).toHaveValue(defaultRegion.name);
      }));

      it("should sort bulk download by regions", fakeAsync(() => {
        const expectedFilter = {
          filter: {
            "regions.id": { eq: defaultRegion.id },
          },
        } as Filters<AudioRecording, keyof AudioRecording>;
        setup(defaultProject, defaultRegion);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        expect(getDownloadLink()).toHaveHref(
          api.batchDownloadUrl(expectedFilter)
        );
      }));
    });

    describe("site", () => {
      it("should not show site if not exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion);
        spec.detectChanges();
        loadForm();
        expect(getSiteInput()).toBeFalsy();
      }));

      it("should show site label if exists", fakeAsync(() => {
        setup(defaultProject, undefined, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(getSiteLabel()).toHaveText("Site");
      }));

      it("should show site if exists", fakeAsync(() => {
        setup(defaultProject, undefined, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(getSiteInput()).toHaveValue(defaultSite.name);
      }));

      it("should sort bulk download by sites", fakeAsync(() => {
        const expectedFilter = {
          filter: {
            "sites.id": { eq: defaultSite.id },
          },
        } as Filters<AudioRecording, keyof AudioRecording>;
        setup(defaultProject, undefined, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        expect(getDownloadLink()).toHaveHref(
          api.batchDownloadUrl(expectedFilter)
        );
      }));
    });

    describe("point", () => {
      it("should show point label if region and site exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(getSiteLabel()).toHaveText("Point");
      }));

      it("should show point if region and site exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(getSiteInput()).toHaveValue(defaultSite.name);
      }));

      it("should sort bulk download by points", fakeAsync(() => {
        const expectedFilter: Filters<AudioRecording> = {
          filter: {
            "sites.id": { eq: defaultSite.id },
          },
        } as Filters<AudioRecording, keyof AudioRecording>;
        setup(defaultProject, defaultRegion, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        expect(getDownloadLink()).toHaveHref(
          api.batchDownloadUrl(expectedFilter)
        );
      }));
    });

    describe("sites without timezones", () => {
      function getSitesWithoutTimezones() {
        return spec.query(SitesWithoutTimezonesComponent);
      }

      it("should pass project to sites without timezones component", fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        expect(getSitesWithoutTimezones().project).toBe(defaultProject);
      }));

      it("should pass region to sites without timezones component if exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion);
        spec.detectChanges();
        loadForm();
        expect(getSitesWithoutTimezones().region).toBe(defaultRegion);
      }));

      it("should not pass region to sites without timezones component if exists", fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        expect(getSitesWithoutTimezones().region).toBeFalsy();
      }));

      it("should pass site to sites without timezones component if exists", fakeAsync(() => {
        setup(defaultProject, undefined, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(getSitesWithoutTimezones().site).toBe(defaultSite);
      }));

      it("should not pass site to sites without timezones component if exists", fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        expect(getSitesWithoutTimezones().site).toBeFalsy();
      }));
    });
  });

  describe("instructions", () => {
    it("should have instructions", () => {
      setup(defaultProject);
      spec.detectChanges();
      expect(spec.query("section")).toContainText("Instructions");
    });

    it("should show a prompt to log in for guest users", () => {
      setup(defaultProject);
      spec.detectChanges();
      expect(spec.query("#guest-run-script")).toBeTruthy();
      expect(spec.query(HiddenCopyComponent)).toBeFalsy();

      expect(
        (spec.query("#guest-run-script") as HTMLElement).innerText
      ).toEqual("Log in to see this command.");
    });

    it("should show instructions for logged in users", () => {
      const authToken = modelData.authToken();
      setup(defaultProject, undefined, undefined, authToken);
      spec.detectChanges();

      expect(spec.query("#guest-run-script")).toBeFalsy();

      const hiddenCopy = spec.query(HiddenCopyComponent);
      expect(hiddenCopy).toBeTruthy();
      expect(hiddenCopy.tooltip()).toBe("Show/Hide command");
      expect(hiddenCopy.value()).toBe(
        `./download_audio_files.ps1 -auth_token "${authToken}"`
      );
    });

    it("should hide logged in user instructions after logout", () => {
      const authToken = modelData.authToken();
      setup(defaultProject, undefined, undefined, authToken);
      spec.detectChanges();

      spec.inject<Writeable<BawSessionService>>(BawSessionService).authToken =
        guestAuthToken;
      spec.detectChanges();

      expect(spec.query("#guest-run-script")).toBeTruthy();
      expect(spec.query(HiddenCopyComponent)).toBeFalsy();
    });
  });
});
