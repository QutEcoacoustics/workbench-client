import { fakeAsync } from "@angular/core/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { BawApiService } from "@baw-api/baw-api.service";
import {
  BawSessionService,
  guestAuthToken,
} from "@baw-api/baw-session.service";
import { DownloadTableComponent } from "@components/audio-recordings/download-table/download-table.component";
import { SitesWithoutTimezonesComponent } from "@components/audio-recordings/sites-without-timezones/sites-without-timezones.component";
import { Writeable } from "@helpers/advancedTypes";
import { AuthToken } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbCollapse, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { HiddenCopyComponent } from "@shared/hidden-copy/hidden-copy.component";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { assertHref } from "@test/helpers/html";
import { MockComponent } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
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
    imports: [SharedModule, NgbCollapseModule, MockAppConfigModule],
    declarations: [
      MockComponent(SitesWithoutTimezonesComponent),
      MockComponent(DownloadTableComponent),
    ],
    // We are relying on AudioRecordingsService's batchDownloadUrl so we will
    // mock out any API calls
    providers: [
      mockProvider(ToastrService),
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
  const getDateToggleInput = () =>
    spec.query<HTMLInputElement>("#date-filtering");
  const getDateInputWrapper = () =>
    spec.query("#date-filters-wrapper", { read: NgbCollapse });
  const getDateStartedAfterInput = () =>
    spec.query<HTMLInputElement>("#date-started-after");
  const getDateFinishedBeforeInput = () =>
    spec.query<HTMLInputElement>("#date-finished-before");
  const getTodInputWrapper = () =>
    spec.query("#tod-filters-wrapper", { read: NgbCollapse });
  const getTodToggleInput = () =>
    spec.query<HTMLInputElement>("#tod-filtering");
  const getTodIgnoreDstInput = () =>
    spec.query<HTMLInputElement>("#tod-ignore-dst");
  const getTodStartedAfterInput = () =>
    spec.query<HTMLInputElement>("#tod-started-after");
  const getTodFinishedBeforeInput = () =>
    spec.query<HTMLInputElement>("#tod-finished-before");

  function toggleTodFilters() {
    const input = getTodToggleInput();
    input.click();
    input.dispatchEvent(new Event("input"));
    spec.detectChanges();
    // NgbCollapse takes a bit to open/close
    spec.tick(1000);
    spec.detectChanges();
  }

  function toggleDateFilters() {
    const input = getDateToggleInput();
    input.click();
    input.dispatchEvent(new Event("input"));
    spec.detectChanges();
    // NgbCollapse takes a bit to open/close
    spec.tick(1000);
    spec.detectChanges();
  }

  function toggleIgnoreDst() {
    const input = getTodIgnoreDstInput();
    input.click();
    input.dispatchEvent(new Event("input"));
    spec.detectChanges();
  }

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
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
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
        const expectedFilter: any = {
          filter: { "regions.id": { eq: defaultRegion.id } },
        };
        setup(defaultProject, defaultRegion);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
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
        const expectedFilter: any = {
          filter: { "sites.id": { eq: defaultSite.id } },
        };
        setup(defaultProject, undefined, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
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
        const expectedFilter: any = {
          filter: { "sites.id": { eq: defaultSite.id } },
        };
        setup(defaultProject, defaultRegion, defaultSite);
        spec.detectChanges();
        loadForm();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
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

  describe("date filter", () => {
    beforeEach(fakeAsync(() => {
      setup(defaultProject);
      // Load form elements
      spec.detectChanges();
      loadForm();
    }));

    describe("toggle fields", () => {
      it("should initially hide date filters", fakeAsync(() => {
        expect(getDateToggleInput()).toBeTruthy();
        expect(getDateInputWrapper().collapsed).toBeTrue();
      }));

      it("should show date filters when checkbox selected", fakeAsync(() => {
        toggleDateFilters();
        expect(getDateToggleInput()).toBeTruthy();
        expect(getDateInputWrapper().collapsed).toBeFalse();
      }));

      it("should hide time of day filters when checkbox unselected", fakeAsync(() => {
        toggleDateFilters();
        toggleDateFilters();
        expect(getDateToggleInput()).toBeTruthy();
        expect(getDateInputWrapper().collapsed).toBeTrue();
      }));
    });

    describe("date inputs", () => {
      beforeEach(fakeAsync(() => {
        toggleDateFilters();
      }));

      it("should include start date in filter", fakeAsync(() => {
        const date = new Date("2020-01-01");
        const expectedFilter: any = {
          filter: {
            "projects.id": { eq: defaultProject.id },
            recordedDate: {
              greaterThanOrEqual: date.toISOString(),
            },
          },
        };

        spec.typeInElement("2020-01-01", getDateStartedAfterInput());
        spec.detectChanges();
        loadForm();

        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
      }));

      it("should include end date in filter", fakeAsync(() => {
        const date = new Date("2020-01-01");
        const expectedFilter: any = {
          filter: {
            "projects.id": { eq: defaultProject.id },
            recordedEndDate: {
              lessThanOrEqual: date.toISOString(),
            },
          },
        };

        spec.typeInElement("2020-01-01", getDateFinishedBeforeInput());
        spec.detectChanges();
        loadForm();

        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
      }));
    });
  });

  describe("time of day filtering", () => {
    describe("enable tod input", () => {
      beforeEach(fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
      }));

      it("should initially hide time of day filters", fakeAsync(() => {
        expect(getTodToggleInput()).toBeTruthy();
        expect(getTodInputWrapper().collapsed).toBeTrue();
      }));

      it("should show time of day filters when checkbox selected", fakeAsync(() => {
        toggleTodFilters();
        expect(getTodToggleInput()).toBeTruthy();
        expect(getTodInputWrapper().collapsed).toBeFalse();
      }));

      it("should hide time of day filters when checkbox unselected", fakeAsync(() => {
        toggleTodFilters();
        toggleTodFilters();
        expect(getTodToggleInput()).toBeTruthy();
        expect(getTodInputWrapper().collapsed).toBeTrue();
      }));

      it("should not affect filter until time inputs are set", fakeAsync(() => {
        const expectedFilter: any = {
          filter: { "projects.id": { eq: defaultProject.id } },
        };
        toggleTodFilters();
        expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
        assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
      }));
    });

    describe("ignore dst input", () => {
      beforeEach(fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        toggleTodFilters();
      }));

      it("should initially be enabled", () => {
        expect(getTodIgnoreDstInput().checked).toBeTrue();
        expect(spec.component.model.todIgnoreDst).toBeTrue();
      });

      it("should disable on click", fakeAsync(() => {
        toggleIgnoreDst();
        loadForm();
        expect(getTodIgnoreDstInput().checked).toBeFalse();
        expect(spec.component.model.todIgnoreDst).toBeFalse();
      }));
    });

    describe("time input", () => {
      beforeEach(fakeAsync(() => {
        setup(defaultProject);
        spec.detectChanges();
        loadForm();
        toggleTodFilters();
      }));

      [true, false].forEach((ignoreDst) => {
        it(`should include start time in filter with ignoreDst ${
          ignoreDst ? "set" : "unset"
        }`, fakeAsync(() => {
          const time = "06:00";
          const expectedFilter: any = {
            filter: {
              "projects.id": { eq: defaultProject.id },
              recordedEndDate: {
                greaterThanOrEqual: {
                  expressions: ignoreDst
                    ? ["local_offset", "time_of_day"]
                    : ["local_tz", "time_of_day"],
                  value: time,
                },
              },
            },
          };

          // If ignoreDst is unset, toggle state
          if (!ignoreDst) {
            toggleIgnoreDst();
          }

          spec.typeInElement(time, getTodStartedAfterInput());
          spec.detectChanges();
          loadForm();

          expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
          assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
        }));

        it(`should include end time in filter with ignoreDst ${
          ignoreDst ? "set" : "unset"
        }`, fakeAsync(() => {
          const time = "06:00";
          const expectedFilter: any = {
            filter: {
              "projects.id": { eq: defaultProject.id },
              recordedDate: {
                lessThanOrEqual: {
                  expressions: ignoreDst
                    ? ["local_offset", "time_of_day"]
                    : ["local_tz", "time_of_day"],
                  value: time,
                },
              },
            },
          };

          // If ignoreDst is unset, toggle state
          if (!ignoreDst) {
            toggleIgnoreDst();
          }

          spec.typeInElement(time, getTodFinishedBeforeInput());
          spec.detectChanges();
          loadForm();

          expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
          assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
        }));
      });
    });
  });

  describe("multiple inputs", () => {
    it("should handle all inputs being set", fakeAsync(() => {
      const startDate = new Date("2019-01-01");
      const endDate = new Date("2020-01-01");
      const startTime = "06:00";
      const endTime = "18:00";

      const expectedFilter: any = {
        filter: {
          "projects.id": { eq: defaultProject.id },
          recordedDate: {
            greaterThanOrEqual: startDate.toISOString(),
            lessThanOrEqual: {
              expressions: ["local_offset", "time_of_day"],
              value: endTime,
            },
          },
          recordedEndDate: {
            lessThanOrEqual: endDate.toISOString(),
            greaterThanOrEqual: {
              expressions: ["local_offset", "time_of_day"],
              value: startTime,
            },
          },
        },
      };

      setup(defaultProject);
      spec.detectChanges();
      loadForm();
      toggleDateFilters();
      toggleTodFilters();

      spec.typeInElement("2019-01-01", getDateStartedAfterInput());
      spec.typeInElement("2020-01-01", getDateFinishedBeforeInput());
      spec.typeInElement(startTime, getTodStartedAfterInput());
      spec.typeInElement(endTime, getTodFinishedBeforeInput());
      spec.detectChanges();
      loadForm();

      expect(api.batchDownloadUrl).toHaveBeenCalledWith(expectedFilter);
      assertHref(getDownloadLink(), api.batchDownloadUrl(expectedFilter));
    }));

    // TODO Expand to test various edge cases
  });

  describe("instructions", () => {
    it("should have instructions", () => {
      setup(defaultProject);
      spec.detectChanges();
      expect(spec.query("section")).toContainText("Instructions");
    });

    it("should show instructions for guest users", () => {
      setup(defaultProject);
      spec.detectChanges();
      expect(spec.query("#run-script-description")).toContainText("Login");
      expect(spec.query("#guest-run-script")).toBeTruthy();
      expect(spec.query(HiddenCopyComponent)).toBeFalsy();
    });

    it("should show instructions for logged in users", () => {
      const authToken = modelData.authToken();
      setup(defaultProject, undefined, undefined, authToken);
      spec.detectChanges();

      expect(spec.query("#run-script-description")).not.toContainText("Login");
      expect(spec.query("#guest-run-script")).toBeFalsy();

      const hiddenCopy = spec.query(HiddenCopyComponent);
      expect(hiddenCopy).toBeTruthy();
      expect(hiddenCopy.tooltip).toBe("Show/Hide command");
      expect(hiddenCopy.value).toBe(
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

      expect(spec.query("#run-script-description")).toContainText("Login");
      expect(spec.query("#guest-run-script")).toBeTruthy();
      expect(spec.query(HiddenCopyComponent)).toBeFalsy();
    });
  });
});
