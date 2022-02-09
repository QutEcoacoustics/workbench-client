import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot } from "@services/config/config.service";
import { LoadingComponent } from "@shared/loading/loading.component";
import { SharedModule } from "@shared/shared.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { assertImage, assertUrl } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { Subject } from "rxjs";
import { SiteCardComponent } from "./site-card.component";

describe("SiteCardComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let defaultRecording: AudioRecording;
  let spec: Spectator<SiteCardComponent>;
  const createComponent = createComponentFactory({
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    component: SiteCardComponent,
  });

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(
      generateSite({ imageUrls: [modelData.imageUrls()[0]] })
    );
    defaultRecording = new AudioRecording(generateAudioRecording());
  });

  function setup(
    isSite: boolean,
    model?: Site | Region,
    recording?: AudioRecording | ApiErrorDetails
  ): Promise<void> {
    const site = isSite ? (model as Site) ?? defaultSite : undefined;
    const region = !isSite ? (model as Region) ?? defaultRegion : undefined;
    let recordings: AudioRecording[] | ApiErrorDetails = [defaultRecording];
    if (recording === null) {
      recordings = [null];
    } else if (recording) {
      recordings =
        recording instanceof AudioRecording ? [recording] : recording;
    }

    spec = createComponent({
      detectChanges: false,
      props: { project: defaultProject, site, region },
    });

    const subject = new Subject<AudioRecording[]>();
    const recordingApi = spec.inject(AudioRecordingsService);
    recordingApi.filterBySite.and.callFake(() => subject);
    return nStepObservable(subject, () => recordings);
  }

  it("should create", () => {
    setup(true);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  describe("title", () => {
    it("should display site name", () => {
      setup(true);
      spec.detectChanges();
      const name = spec.query<HTMLHeadingElement>("h5#name");
      expect(name).toBeTruthy();
      expect(name.innerText).toContain(defaultSite.name);
    });

    it("should navigate user to site when clicking site name", () => {
      setup(true);
      spec.detectChanges();
      const name = spec.query<HTMLAnchorElement>("#nameLink");
      assertUrl(name, defaultSite.getViewUrl(defaultProject));
    });
  });

  describe("image", () => {
    function getImage() {
      return spec.query<HTMLImageElement>("img");
    }

    function getImageLink() {
      return spec.query<HTMLAnchorElement>("#imageLink");
    }

    it("should display site image", () => {
      const site = new Site(generateSite({ imageUrls: undefined }));
      setup(true, site);
      spec.detectChanges();

      assertImage(
        getImage(),
        `${websiteHttpUrl}${assetRoot}/images/site/site_span4.png`,
        `${site.name} alt`
      );
    });

    it("should display custom site image", () => {
      setup(true);
      spec.detectChanges();
      assertImage(
        getImage(),
        defaultSite.imageUrls.at(0).url,
        `${defaultSite.name} alt`
      );
    });

    it("should navigate user to site when clicking site image", () => {
      setup(true);
      spec.detectChanges();
      assertUrl(getImageLink(), defaultSite.getViewUrl(defaultProject));
    });
  });

  const inputTypes = [
    {
      modelType: "site",
      setup: (recording?: AudioRecording) => setup(true, undefined, recording),
      play: true,
    },
    {
      modelType: "region",
      setup: () => setup(false),
      play: false,
    },
  ];

  inputTypes.forEach((inputType) => {
    function getLinks() {
      return {
        details: spec.query<HTMLAnchorElement>("#details"),
        play: spec.query<HTMLAnchorElement>("#play"),
        noAudio: spec.query<HTMLAnchorElement>("#no-audio"),
        visualize: spec.query<HTMLAnchorElement>("#visualize"),
        audioRecordings: spec.query<HTMLAnchorElement>("#audio-recordings"),
      };
    }

    function assertLink(link: HTMLAnchorElement, text: string) {
      expect(link).toHaveText(text);
    }

    describe(inputType.modelType + " links", () => {
      let recordingPromise: Promise<any>;

      function initializeComponent() {
        recordingPromise = inputType.setup();
        spec.detectChanges();
      }

      it("should display details link", () => {
        initializeComponent();
        assertLink(getLinks().details, "Details");
      });

      it("should navigate user to site when clicking details link", () => {
        initializeComponent();
        assertUrl(
          getLinks().details,
          spec.component.model.getViewUrl(defaultProject)
        );
      });

      if (inputType.play) {
        it("should display loading spinner", () => {
          initializeComponent();
          expect(spec.query(LoadingComponent)).toBeTruthy();
        });

        it("should clear loading spinner when recording retrieved", async () => {
          initializeComponent();
          await recordingPromise;
          spec.detectChanges();
          expect(spec.query(LoadingComponent)).toBeFalsy();
        });

        it("should display play link if recording exists", async () => {
          initializeComponent();
          await recordingPromise;
          spec.detectChanges();
          assertLink(getLinks().play, "Play");
        });

        it("should display no audio placeholder if no recordings", async () => {
          recordingPromise = inputType.setup(null);
          spec.detectChanges();
          await recordingPromise;
          spec.detectChanges();
          assertLink(getLinks().noAudio, "No Audio");
        });

        it("should navigate user to listen page when clicking play link", async () => {
          initializeComponent();
          await recordingPromise;
          spec.detectChanges();
          assertUrl(getLinks().play, spec.component.recording.viewUrl);
        });
      } else {
        it("should not display play link", () => {
          initializeComponent();
          expect(getLinks().play).toBeFalsy();
        });
      }

      it("should display visualize link", () => {
        initializeComponent();
        assertLink(getLinks().visualize, "Visualise");
      });

      it("should navigate user to visualizer page when clicking visualize link", () => {
        initializeComponent();
        assertUrl(getLinks().visualize, spec.component.model.visualizeUrl);
      });

      it("should display audio recordings link", async () => {
        initializeComponent();
        assertLink(getLinks().audioRecordings, "Audio Recordings");
      });

      it("should navigate user to audio recordings page when clicking audio recordings link", async () => {
        initializeComponent();
        assertUrl(
          getLinks().audioRecordings,
          spec.component.model.getAudioRecordingsUrl(spec.component.project)
        );
      });
    });
  });

  describe("points", () => {
    function getPoints() {
      return spec.query<HTMLSpanElement>("span.badge");
    }

    it("should not display if site model", () => {
      setup(true);
      spec.detectChanges();
      expect(getPoints()).toBeFalsy();
    });

    it("should display 0 region points", () => {
      const region = new Region({ ...generateRegion(), siteIds: undefined });
      setup(false, region);
      spec.detectChanges();
      expect(getPoints().innerText.trim()).toBe("0 Points");
    });

    it("should display multiple region points", () => {
      const region = new Region({ ...generateRegion(), siteIds: [1, 2, 3] });
      setup(false, region);
      spec.detectChanges();
      expect(getPoints().innerText.trim()).toBe("3 Points");
    });
  });
});
