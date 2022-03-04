import { RouterTestingModule } from "@angular/router/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { Errorable } from "@helpers/advancedTypes";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot } from "@services/config/config.service";
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

// TODO Re-enable tests #1809
xdescribe("SiteCardComponent", () => {
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
    recording?: Errorable<AudioRecording>
  ): Promise<void> {
    const site = isSite ? (model as Site) ?? defaultSite : undefined;
    const region = !isSite ? (model as Region) ?? defaultRegion : undefined;
    let recordings: Errorable<AudioRecording[]> = [defaultRecording];
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
      function initializeComponent() {
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
