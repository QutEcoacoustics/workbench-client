import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { StrongRoute } from "@interfaces/strongRoute";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/config/config.service";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { modelData } from "@test/helpers/faker";
import {
  interceptShowApiRequest,
  nStepObservable,
} from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { Subject } from "rxjs";
import { AUDIO_RECORDING, PROJECT } from "@baw-api/ServiceTokens";
import { INJECTOR } from "@angular/core";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ProjectsService } from "@baw-api/project/projects.service";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let spec: Spectator<CardComponent>;

  let recordingApi: SpyObject<AudioRecordingsService>;
  let projectsApi: SpyObject<ProjectsService>;

  const createComponent = createComponentFactory({
    component: CardComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MockBawApiModule,
      MockDirectivesModule,
      PipesModule,
    ],
  });

  function setup(
    model: Project | Region,
    recordings: Errorable<AudioRecording[]> = []
  ) {
    spec = createComponent({ detectChanges: false, props: { model } });

    const injector = spec.inject(INJECTOR) as SpyObject<AssociationInjector>;
    model["injector"] = injector;

    const subject = new Subject<AudioRecording[]>();
    recordingApi = spec.inject(AUDIO_RECORDING.token);

    const isModelProject = model instanceof Project;
    if (isModelProject) {
      recordingApi.filterByProject.and.callFake(() => subject);
    } else {
      recordingApi.filterByRegion.and.callFake(() => subject);
    }

    projectsApi = spec.inject(PROJECT.token);
    interceptShowApiRequest(
      projectsApi,
      injector,
      isModelProject ? model : new Project(generateProject()),
      Project
    );

    return nStepObservable(
      subject,
      () => recordings,
      isBawApiError(recordings)
    );
  }

  function validateCard<T extends Project | Region>(
    createModel: (data?: any) => T
  ) {
    it("should create", () => {
      setup(createModel());
      spec.detectChanges();
      expect(spec.component).toBeTruthy();
    });

    it("should have title", () => {
      const model = createModel();
      setup(model);
      spec.detectChanges();
      const title = spec.query<HTMLHeadingElement>("h4");
      expect(title).toContainText(model.name);
    });

    it("should handle local image", () => {
      const baseUrl = `${assetRoot}/broken_link`;
      const model = createModel({ imageUrls: modelData.imageUrls(baseUrl) });
      setup(model);
      spec.detectChanges();

      const image = spec.query<HTMLImageElement>("img");
      expect(image).toHaveImage(`${websiteHttpUrl}${baseUrl}/300/300`, {
        alt: `${model.name} image`,
      });
    });

    it("should display remote image", () => {
      const baseUrl = "https://broken_link/broken_link";
      const model = createModel({ imageUrls: modelData.imageUrls(baseUrl) });
      setup(model);
      spec.detectChanges();

      const image = spec.query<HTMLImageElement>("img");
      expect(image).toHaveImage(baseUrl + "/300/300", {
        alt: `${model.name} image`,
      });
    });

    it("should have default description when none provided", () => {
      setup(createModel({ descriptionHtmlTagline: undefined }));
      spec.detectChanges();

      const description = spec.query(".card-text");
      expect(description).toContainText("No description given");
    });

    it("should have description with HTML when provided", () => {
      const model = createModel();
      setup(model);
      spec.detectChanges();

      const description = spec.query(".card-text");
      expect(description.innerHTML).toContain(model.descriptionHtmlTagline);
    });

    // TODO Assert truncation styling applies
    xit("should shorten description when description is long", () => {
      const model = createModel({
        descriptionHtmlTagline: modelData.descriptionLong(),
      });
      setup(model);
      spec.detectChanges();
    });

    it("should have image route when route provided", () => {
      const strongRoute = StrongRoute.newRoot().addFeatureModule(
        modelData.random.word()
      );
      const model = createModel({ route: strongRoute });
      setup(model);
      spec.detectChanges();

      const route = spec.query<HTMLAnchorElement>(".card-image a");
      expect(route).toHaveUrl(model.viewUrl);
    });

    it("should have title route when route provided", () => {
      const strongRoute = StrongRoute.newRoot().addFeatureModule(
        modelData.random.word()
      );
      const model = createModel({ route: strongRoute });
      setup(model);
      spec.detectChanges();

      const link = spec.query<HTMLAnchorElement>(".card-title");
      expect(link).toHaveUrl(model.viewUrl);
    });

    function getNoAudioBadge() {
      return spec.query("#no-audio");
    }

    it("should show loading badge while determining if model has recordings", () => {
      const model = createModel();
      setup(model);
      spec.detectChanges();
      assertSpinner(getNoAudioBadge(), true);
    });

    it("should show no audio badge if model has no recordings", async () => {
      const model = createModel();
      const promise = setup(model, []);
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      const badge = getNoAudioBadge();
      assertSpinner(badge, false);
      expect(badge).toContainText("No audio");
    });

    it("should not show no audio badge if model has recordings", async () => {
      const model = createModel();
      const promise = setup(model, [
        new AudioRecording(generateAudioRecording()),
      ]);
      spec.detectChanges();
      await promise;
      spec.detectChanges();

      const badge = getNoAudioBadge();
      expect(badge).toBeFalsy();
    });
  }

  describe("Region", () => {
    validateCard((data) => new Region(generateRegion(data ?? {})));
  });

  describe("Project", () => {
    validateCard((data) => new Project(generateProject(data ?? {})));
  });
});
