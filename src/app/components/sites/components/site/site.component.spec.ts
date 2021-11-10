import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@components/shared/shared.module";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { assetRoot } from "@services/config/config.service";
import { MapComponent } from "@shared/map/map.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { FilterExpectations, nStepObservable } from "@test/helpers/general";
import { assertImage } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { SiteComponent } from "./site.component";

const mockMapComponent = MockComponent(MapComponent);

// TODO This component is doing too many things. Split it into
// smaller components to simplify tests and logic

describe("SiteComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let defaultRecording: AudioRecording;
  let eventsApi: SpyObject<ShallowAudioEventsService>;
  let recordingsApi: SpyObject<AudioRecordingsService>;
  let spec: Spectator<SiteComponent>;
  const createComponent = createComponentFactory({
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
    declarations: [mockMapComponent],
    component: SiteComponent,
  });

  function setup(project: Project, site: Site, region?: Region) {
    spec = createComponent({
      detectChanges: false,
      props: { project, site, region },
    });

    eventsApi = spec.inject(ShallowAudioEventsService);
    recordingsApi = spec.inject(AudioRecordingsService);
  }

  function interceptEventsRequest(
    audioEvents: AudioEvent[] | ApiErrorDetails = [],
    expectation: FilterExpectations<AudioEvent> = () => {}
  ) {
    const subject = new Subject<AudioEvent[]>();
    eventsApi.filterBySite.andCallFake((filters) => {
      expectation(filters);
      return subject;
    });
    return nStepObservable(
      subject,
      () => audioEvents,
      isInstantiated(audioEvents["status"])
    );
  }

  function interceptRecordingsRequest(
    recordings: AudioRecording[] | ApiErrorDetails = [],
    newExpectation: FilterExpectations<AudioRecording> = () => {},
    oldExpectation: FilterExpectations<AudioRecording> = () => {}
  ) {
    const subject = new Subject<AudioRecording[]>();

    recordingsApi.filterBySite.andCallFake((filters, site) => {
      if (filters.sorting.direction === "asc") {
        oldExpectation(filters, site);
      } else {
        newExpectation(filters, site);
      }

      return subject;
    });

    return nStepObservable(
      subject,
      () => recordings,
      isInstantiated(recordings["status"])
    );
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(
      generateSite({ imageUrls: [modelData.imageUrls()[0]] })
    );
    defaultRecording = new AudioRecording(generateAudioRecording());
  });

  it("should create", () => {
    setup(defaultProject, defaultSite);
    interceptEventsRequest();
    interceptRecordingsRequest();
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("Project", () => {
    it("should display project name", () => {
      setup(defaultProject, defaultSite);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const title = spec.query<HTMLHeadingElement>("h2");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain(`Project: ${defaultProject.name}`);
    });
  });

  describe("Region", () => {
    it("should not display region name if doesn't exist", () => {
      setup(defaultProject, defaultSite, undefined);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const title = spec.query<HTMLHeadingElement>("h3");
      expect(title).toBeFalsy();
    });

    it("should display region name if exists", () => {
      setup(defaultProject, defaultSite, defaultRegion);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const title = spec.query<HTMLHeadingElement>("h3");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain(`Site: ${defaultRegion.name}`);
    });
  });

  describe("Site", () => {
    it("should display site name", () => {
      setup(defaultProject, defaultSite);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const title = spec.query<HTMLHeadingElement>("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain(defaultSite.name);
    });

    it("should display default site image", () => {
      const site = new Site(generateSite({ imageUrls: undefined }));
      setup(defaultProject, site);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const image = spec.query<HTMLImageElement>("img");
      assertImage(
        image,
        `${websiteHttpUrl}${assetRoot}/images/site/site_span4.png`,
        `${site.name} image`
      );
    });

    it("should display custom site image", () => {
      setup(defaultProject, defaultSite);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const image = spec.query<HTMLImageElement>("img");
      assertImage(
        image,
        defaultSite.imageUrls.at(0).url,
        `${defaultSite.name} image`
      );
    });

    it("should display default description if model has none", () => {
      const site = new Site(generateSite({ descriptionHtml: undefined }));
      setup(defaultProject, site);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const description = spec.query("#site_description");
      expect(description).toBeTruthy();
      expect(description.innerHTML).toContain("<i>No description found</i>");
    });

    it("should display site description with html markup", () => {
      setup(defaultProject, defaultSite);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();

      const description = spec.query("#site_description");
      expect(description).toBeTruthy();
      expect(description.innerHTML).toContain(defaultSite.descriptionHtml);
    });
  });

  describe("Google Maps", () => {
    beforeEach(() => {
      setup(defaultProject, defaultSite);
      interceptEventsRequest();
      interceptRecordingsRequest();
      spec.detectChanges();
    });

    it("should create google maps component", () => {
      expect(spec.query(mockMapComponent)).toBeTruthy();
    });

    it("should create site marker", () => {
      const maps = spec.query(mockMapComponent);
      expect(maps.markers.toArray()).toEqual([defaultSite.getMapMarker()]);
    });
  });

  describe("Recordings", () => {
    describe("spinner", () => {
      function getRecordingsLoader() {
        return spec.query("#recordings-loader");
      }

      beforeEach(() => {
        setup(defaultProject, defaultSite);
        interceptEventsRequest();
      });

      it("should display spinner while audio recordings load", () => {
        interceptRecordingsRequest();
        spec.detectChanges();
        expect(getRecordingsLoader()).toBeTruthy();
      });

      it("should clear spinner if no audio recordings", async () => {
        const promise = interceptRecordingsRequest();
        spec.detectChanges();
        await promise;
        spec.detectChanges();
        expect(getRecordingsLoader()).toBeFalsy();
      });

      it("should clear spinner if audio recordings", async () => {
        const promise = interceptRecordingsRequest([defaultRecording]);
        spec.detectChanges();
        await promise;
        spec.detectChanges();
        expect(getRecordingsLoader()).toBeFalsy();
      });
    });

    describe("description", () => {
      function getPlaceholderDescription() {
        return spec.query("#recordings-placeholder-description");
      }

      function getErrorDescription() {
        return spec.query("#recordings-error-description");
      }

      function getRecordingDates() {
        return spec.query("#recording-dates");
      }

      async function setupRecordings(
        recordings: AudioRecording[] | ApiErrorDetails
      ) {
        setup(defaultProject, defaultSite);
        interceptEventsRequest();
        const promise = interceptRecordingsRequest(recordings);
        spec.detectChanges();
        await promise;
        spec.detectChanges();
      }

      [
        {
          label: "no audio recordings",
          recordings: () => [],
          placeholder: true,
          error: false,
          dates: false,
        },
        {
          label: "audio recordings error",
          recordings: () => generateApiErrorDetails(),
          placeholder: false,
          error: true,
          dates: false,
        },
        {
          label: "audio recordings exist",
          recordings: () => [defaultRecording],
          placeholder: false,
          error: false,
          dates: true,
        },
      ].forEach((test) => {
        it(`should ${test.placeholder ? "" : "not "}display placeholder if ${
          test.label
        }`, async () => {
          await setupRecordings(test.recordings());
          const placeholder = getPlaceholderDescription();
          if (test.placeholder) {
            expect(placeholder).toBeTruthy();
            expect(placeholder).toHaveText(
              "This site does not contain any audio recordings."
            );
          } else {
            expect(placeholder).toBeFalsy();
          }
        });

        it(`should ${test.error ? "" : "not "}display error message if ${
          test.label
        }`, async () => {
          await setupRecordings(test.recordings());
          const placeholder = getErrorDescription();
          if (test.error) {
            expect(placeholder).toBeTruthy();
            expect(placeholder).toHaveText("Unable to load site recordings.");
          } else {
            expect(placeholder).toBeFalsy();
          }
        });

        it(`should ${test.dates ? "" : "not "}display recording dates if ${
          test.label
        }`, async () => {
          await setupRecordings(test.recordings());
          const dates = getRecordingDates();
          if (test.dates) {
            expect(dates).toBeTruthy();
          } else {
            expect(dates).toBeFalsy();
          }
        });
      });
    });

    xdescribe("dates", () => {
      it("should display start and end date of audio recordings", async () => {});
    });

    xdescribe("play", () => {
      it("should initially display loading animation", () => {});
      it("should clear loading animation on load", () => {});
      it("should create play link", () => {});
      it("should route to correct location", () => {});
    });

    xdescribe("visualize", () => {
      it("should create visualize link", () => {});
      it("should route to correct location", () => {});
    });

    describe("filterByDates", () => {
      it("should request list of newest audio recordings", (done) => {
        setup(defaultProject, defaultSite);
        interceptEventsRequest();
        interceptRecordingsRequest([], (filter, site) => {
          expect(filter).toEqual({
            sorting: { orderBy: "recordedDate", direction: "desc" },
          });
          expect(site).toEqual(defaultSite);
          done();
        });
        spec.detectChanges();
      });

      it("should request list of oldest audio recordings", (done) => {
        setup(defaultProject, defaultSite);
        interceptEventsRequest();
        interceptRecordingsRequest([], undefined, (filter, site) => {
          expect(filter).toEqual({
            sorting: { orderBy: "recordedDate", direction: "asc" },
            paging: { items: 1 },
          });
          expect(site).toEqual(defaultSite);
          done();
        });
        spec.detectChanges();
      });

      it("should make two requests", async () => {
        setup(defaultProject, defaultSite);
        interceptEventsRequest();
        const promise = interceptRecordingsRequest();
        spec.detectChanges();
        await promise;

        expect(recordingsApi.filterBySite).toHaveBeenCalledTimes(2);
      });
    });
  });

  // TODO
  xdescribe("annotations", () => {
    it("should display spinner while tags are unresolved", () => {});
    it("should display placeholder if no tags", () => {});
    it("should display single tag", () => {});
    it("should display tag text", () => {});
    it("should display tag creator", () => {});
    it("should route to tag", () => {});
    it("should display multiple tags", () => {});
  });
});
