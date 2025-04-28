import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Errorable } from "@helpers/advancedTypes";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { Subject } from "rxjs";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { SiteCardComponent } from "./site-card.component";

describe("SiteCardComponent", () => {
  let defaultProject: Project;
  let defaultSite: Site;
  let defaultRecording: AudioRecording;
  let spec: Spectator<SiteCardComponent>;

  const createComponent = createRoutingFactory({
    component: SiteCardComponent,
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
    defaultRecording = new AudioRecording(generateAudioRecording());
  });

  function setup(
    model?: Site | Region,
    recordings?: Errorable<AudioRecording[]>
  ): Promise<void> {
    spec = createComponent({
      detectChanges: false,
      props: {
        project: defaultProject,
        site: model instanceof Site ? model : undefined,
        region: model instanceof Region ? model : undefined,
      },
    });

    const subject = new Subject<AudioRecording[]>();
    const recordingApi = spec.inject(AudioRecordingsService);
    recordingApi.filterBySite.and.callFake(() => subject);
    recordingApi.filterByRegion.and.callFake(() => subject);
    return nStepObservable(subject, () => recordings);
  }

  it("should create", () => {
    setup(defaultSite);
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  [
    {
      modelType: "site",
      createModel: (data?: any) => new Site(generateSite(data)),
      modelDetails: (model: Site) => model.getViewUrl(defaultProject),
    },
    {
      modelType: "region",
      createModel: (data?: any) => new Region(generateRegion(data)),
      modelDetails: (model: Region) => model.getViewUrl(defaultProject),
    },
  ].forEach(({ modelType, createModel }) => {
    describe(modelType, () => {
      let defaultModel: Site | Region;

      beforeEach(() => {
        defaultModel = createModel();
      });

      describe("title", () => {
        it("should display name", () => {
          setup(defaultModel);
          spec.detectChanges();
          const name = spec.query<HTMLHeadingElement>("h5#name");
          expect(name).toBeTruthy();
          expect(name).toContainText(defaultModel.name);
        });

        it("should navigate user to model details page when clicking name", () => {
          setup(defaultModel);
          spec.detectChanges();
          const name = spec.query<HTMLAnchorElement>("#nameLink");
          expect(name).toHaveUrl(defaultModel.getViewUrl(defaultProject));
        });
      });

      describe("image", () => {
        function getImage() {
          return spec.query<HTMLImageElement>("img");
        }

        it("should display default model image", () => {
          const model = createModel({ imageUrls: undefined });
          setup(model);
          spec.detectChanges();

          expect(getImage()).toHaveImage(
            `${websiteHttpUrl}${model.imageUrls[0].url}`,
            { alt: `${model.name} alt` }
          );
        });

        it("should display custom model image", () => {
          setup(defaultModel);
          spec.detectChanges();
          expect(getImage()).toHaveImage(defaultModel.imageUrls.at(0).url, {
            alt: `${defaultModel.name} alt`,
          });
        });
      });

      describe("no audio badge", () => {
        function getBadge() {
          return spec.query<HTMLSpanElement>("#no-audio");
        }

        function assertLoading(isLoading: boolean) {
          assertSpinner(spec.query(".nav"), isLoading);
        }

        it("should display loading spinner while determining if model has audio", () => {
          setup(defaultModel);
          spec.detectChanges();
          assertLoading(true);
        });

        it("should display badge if model has no audio", async () => {
          const promise = setup(defaultModel, []);
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertLoading(false);
          expect(getBadge()).toContainText("No audio yet");
        });

        it("should not display badge if model has audio", async () => {
          const promise = setup(defaultModel, [defaultRecording]);
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertLoading(false);
          expect(getBadge()).toBeFalsy();
        });

        it("should not display badge if recordings request fails", async () => {
          const promise = setup(defaultModel, generateBawApiError());
          spec.detectChanges();
          await promise;
          spec.detectChanges();
          assertLoading(false);
          expect(getBadge()).toBeFalsy();
        });
      });
    });
  });

  describe("points", () => {
    function getBadge() {
      return spec.query<HTMLSpanElement>("#points");
    }

    it("should not display if site model", () => {
      setup(defaultSite);
      spec.detectChanges();
      expect(getBadge()).toBeFalsy();
    });

    it("should display 0 region points", () => {
      const region = new Region({ ...generateRegion(), siteIds: undefined });
      setup(region);
      spec.detectChanges();
      expect(getBadge()).toContainText("0 Points");
    });

    it("should display 1 region point", () => {
      const region = new Region({ ...generateRegion(), siteIds: [1] });
      setup(region);
      spec.detectChanges();
      expect(getBadge()).toContainText("1 Point");
    });

    it("should display multiple region points", () => {
      const region = new Region({ ...generateRegion(), siteIds: [1, 2, 3] });
      setup(region);
      spec.detectChanges();
      expect(getBadge()).toContainText("3 Points");
    });
  });
});
