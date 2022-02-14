import { fakeAsync } from "@angular/core/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { inputValue } from "@test/helpers/html";
import { DownloadAudioRecordingsComponent } from "./download.component";

describe("DownloadAudioRecordingsComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spec: SpectatorRouting<DownloadAudioRecordingsComponent>;
  const createComponent = createRoutingFactory({
    component: DownloadAudioRecordingsComponent,
    imports: [SharedModule, MockBawApiModule],
  });

  function getProjectInput() {
    return spec.query<HTMLInputElement>("#project");
  }

  function getRegionInput() {
    return spec.query<HTMLInputElement>("#region");
  }

  function getSiteInput() {
    return spec.query<HTMLInputElement>("#site");
  }

  function getSiteLabel() {
    return spec.query<HTMLLabelElement>("#site-label");
  }

  function interceptDownloadUrl(
    url: string = "/batch_download",
    initialFilter: (filter: Filters<AudioRecording>) => void = () => {},
    updatedFilter: (filter: Filters<AudioRecording>) => void = () => {}
  ) {
    let count = 0;
    const initialExpectation = 3;
    const updatedExpectation = 4;

    const recordingsApi = spec.inject(AudioRecordingsService);
    recordingsApi.batchDownloadUrl.and.callFake(
      (filter: Filters<AudioRecording>) => {
        count++;
        if (count === initialExpectation) {
          initialFilter(filter);
        } else if (count === updatedExpectation) {
          updatedFilter(filter);
        }

        return url;
      }
    );
  }

  function setup(project: Project, region?: Region, site?: Site) {
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
    });
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
  });

  describe("models", () => {
    function filterByProject(
      filter: Filters<AudioRecording>,
      project: Project
    ) {
      expect(filter.filter["projects.id"]).toEqual({ eq: project.id });
      expect(filter.filter["regions.id"]).toBeUndefined();
      expect(filter.filter["sites.id"]).toBeUndefined();
    }

    function filterByRegion(filter: Filters<AudioRecording>, region: Region) {
      expect(filter.filter["projects.id"]).toBeUndefined();
      expect(filter.filter["regions.id"]).toEqual({ eq: region.id });
      expect(filter.filter["sites.id"]).toBeUndefined();
    }

    function filterBySite(filter: Filters<AudioRecording>, site: Site) {
      expect(filter.filter["projects.id"]).toBeUndefined();
      expect(filter.filter["regions.id"]).toBeUndefined();
      expect(filter.filter["sites.id"]).toEqual({ eq: site.id });
    }

    describe("project", () => {
      it("should show project if exists", fakeAsync(() => {
        setup(defaultProject);
        interceptDownloadUrl();
        spec.detectChanges();
        // Have to do this tick because of
        // https://github.com/angular/angular/issues/22606#issuecomment-377390233
        spec.tick();
        expect(getProjectInput()).toHaveValue(defaultProject.name);
      }));

      it("should sort bulk download by projects", (done) => {
        setup(defaultProject);
        interceptDownloadUrl("/bulk_download", (filter) => {
          filterByProject(filter, defaultProject);
          done();
        });
        spec.detectChanges();
      });
    });

    describe("region", () => {
      it("should not show region if not exists", () => {
        setup(defaultProject);
        interceptDownloadUrl();
        spec.detectChanges();
        expect(getRegionInput()).toBeFalsy();
      });

      it("should show region if exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion);
        interceptDownloadUrl();
        spec.detectChanges();
        spec.tick();
        expect(getRegionInput()).toHaveValue(defaultRegion.name);
      }));

      it("should sort bulk download by regions", (done) => {
        setup(defaultProject, defaultRegion);
        interceptDownloadUrl("/bulk_download", (filter) => {
          filterByRegion(filter, defaultRegion);
          done();
        });
        spec.detectChanges();
      });
    });

    describe("site", () => {
      it("should not show site if not exists", () => {
        setup(defaultProject, defaultRegion);
        interceptDownloadUrl();
        spec.detectChanges();
        expect(getSiteInput()).toBeFalsy();
      });

      it("should show site label if exists", () => {
        setup(defaultProject, undefined, defaultSite);
        interceptDownloadUrl();
        spec.detectChanges();
        expect(getSiteLabel()).toHaveText("Site");
      });

      it("should show site if exists", fakeAsync(() => {
        setup(defaultProject, undefined, defaultSite);
        interceptDownloadUrl();
        spec.detectChanges();
        spec.tick();
        expect(getSiteInput()).toHaveValue(defaultSite.name);
      }));

      it("should sort bulk download by sites", (done) => {
        setup(defaultProject, undefined, defaultSite);
        interceptDownloadUrl("/bulk_download", (filter) => {
          filterBySite(filter, defaultSite);
          done();
        });
        spec.detectChanges();
      });
    });

    describe("point", () => {
      it("should show point label if region and site exists", () => {
        setup(defaultProject, defaultRegion, defaultSite);
        interceptDownloadUrl();
        spec.detectChanges();
        expect(getSiteLabel()).toHaveText("Point");
      });

      it("should show point if region and site exists", fakeAsync(() => {
        setup(defaultProject, defaultRegion, defaultSite);
        interceptDownloadUrl();
        spec.detectChanges();
        spec.tick();
        expect(getSiteInput()).toHaveValue(defaultSite.name);
      }));

      it("should sort bulk download by points", (done) => {
        setup(defaultProject, undefined, defaultSite);
        interceptDownloadUrl("/bulk_download", (filter) => {
          filterBySite(filter, defaultSite);
          done();
        });
        spec.detectChanges();
      });
    });
  });

  describe("recording started after", () => {
    it("should initially not include date in filter", (done) => {
      setup(defaultProject);
      interceptDownloadUrl("/bulk_download", (filter) => {
        expect(filter.filter["recordedDate"]).toBeUndefined();
        done();
      });
      spec.detectChanges();
    });

    it("should include date in filter when selected", (done) => {
      const date = new Date("2020-01-01");
      setup(defaultProject);
      interceptDownloadUrl(
        "/bulk_download",
        () => {
          // Update input after the form has been set
          inputValue(spec.element, "#recording-started-after", "2020-01-01");
          spec.detectChanges();
        },
        (filter) => {
          expect(filter.filter["recordedDate"]).toEqual({
            greaterThan: date.toISOString(),
          });
          done();
        }
      );
      spec.detectChanges();
    });
  });

  describe("recording finished after", () => {
    it("should initially not include date in filter", (done) => {
      setup(defaultProject);
      interceptDownloadUrl("/bulk_download", (filter) => {
        expect(filter.filter["recordedEndDate"]).toBeUndefined();
        done();
      });
      spec.detectChanges();
    });

    it("should include date in filter when selected", (done) => {
      const date = new Date("2020-01-01");
      setup(defaultProject);
      interceptDownloadUrl(
        "/bulk_download",
        () => {
          // Update input after the form has been set
          inputValue(spec.element, "#recording-finished-before", "2020-01-01");
          spec.detectChanges();
        },
        (filter) => {
          expect(filter.filter["recordedEndDate"]).toEqual({
            lessThan: date.toISOString(),
          });
          done();
        }
      );
      spec.detectChanges();
    });
  });

  it("should have instructions", () => {
    setup(defaultProject);
    spec.detectChanges();
    expect(spec.query("section")).toContainText("Instructions");
  });
});
