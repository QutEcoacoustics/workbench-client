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
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { FilterExpectations, nStepObservable } from "@test/helpers/general";
import { assertImage } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { Subject } from "rxjs";
import { SiteComponent } from "./site.component";

describe("SiteComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let eventsApi: SpyObject<ShallowAudioEventsService>;
  let recordingsApi: SpyObject<AudioRecordingsService>;
  let spec: Spectator<SiteComponent>;
  const createComponent = createComponentFactory({
    imports: [SharedModule, MockBawApiModule, RouterTestingModule],
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
    newExpectation: FilterExpectations<AudioEvent> = () => {},
    oldExpectation: FilterExpectations<AudioEvent> = () => {}
  ) {
    const subject = new Subject<AudioRecording[]>();

    recordingsApi.filterBySite.andCallFake((filters) => {
      if (filters.sorting.direction === "asc") {
        oldExpectation(filters);
      } else {
        newExpectation(filters);
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
    defaultSite = new Site(generateSite());
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
      const site = new Site({ ...generateSite(), imageUrl: undefined });
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
      assertImage(image, defaultSite.imageUrl, `${defaultSite.name} image`);
    });

    it("should display default description if model has none", () => {
      const site = new Site({ ...generateSite(), descriptionHtml: undefined });
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
      expect(spec.query(MapComponent)).toBeTruthy();
    });

    it("should create site marker", () => {
      const maps = spec.query(MapComponent);
      expect(maps.markers.toArray()).toEqual([defaultSite.getMapMarker()]);
    });
  });

  // TODO
  xdescribe("Recordings", () => {
    it("should display spinner while audio recordings load", () => {});
    it("should display placeholder if no audio recordings", () => {});
    it("should display start and end date of audio recordings", () => {});
    it("should display play link", () => {});
    it("should display visualize link", () => {});
  });

  // TODO
  xdescribe("Tags", () => {
    it("should display spinner while tags are unresolved", () => {});
    it("should display placeholder if no tags", () => {});
    it("should display single tag", () => {});
    it("should display tag text", () => {});
    it("should display tag creator", () => {});
    it("should route to tag", () => {});
    it("should display multiple tags", () => {});
  });
});
