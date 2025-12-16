import { provideRouter } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  AUDIO_RECORDING,
  MEDIA,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { SpectrogramComponent } from "../../../../../node_modules/@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { TagsService } from "@baw-api/tag/tags.service";
import { VerificationSummary } from "@models/AudioEvent/VerificationSummary";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { AssociationInjector } from "@models/ImplementsInjector";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { MediaService } from "@services/media/media.service";
import { IconsModule } from "@shared/icons/icons.module";
import { generateVerificationSummary } from "@test/fakes/AudioEvent/VerificationSummary";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { generateSite } from "@test/fakes/Site";
import { generateTag } from "@test/fakes/Tag";
import { of } from "rxjs";
import { exampleBase64 } from "src/test-assets/example-0.5s.base64";
import { AnnotationEventCardComponent } from "./annotation-event-card.component";

describe("AnnotationEventCardComponent", () => {
  let spec: Spectator<AnnotationEventCardComponent>;
  let injector: SpyObject<AssociationInjector>;

  let mediaService: SpyObject<MediaService>;
  let audioRecordingApi: SpyObject<AudioRecordingsService>;
  let tagApi: SpyObject<TagsService>;
  let siteApi: SpyObject<ShallowSitesService>;

  let mockAnnotation: Annotation;
  let mockVerificationSummary: VerificationSummary[];
  let mockAudioRecording: AudioRecording;
  let mockTag: Tag;
  let mockSite: Site;

  const createComponent = createComponentFactory({
    component: AnnotationEventCardComponent,
    imports: [IconsModule],
    providers: [provideMockBawApi(), provideRouter([])],
  });

  // const spectrogram = () =>
  //   spectator.query<SpectrogramComponent>("oe-spectrogram");
  const listenLink = () =>
    spec.query<HTMLAnchorElement>(".more-information-link");

  const tagInfoContainer = () => spec.query(".tag-information");
  const tagLinks = () => spec.queryAll<HTMLAnchorElement>(".tag-link");
  const tagVerifiedIcons = () => spec.queryAll(".verified-icon");

  const scoreElement = () => spec.query(".tag-score");
  const noScoreElement = () => spec.query(".no-score-placeholder");

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    injector = spec.inject(ASSOCIATION_INJECTOR);

    mediaService = spec.inject(MEDIA.token);
    spyOn(mediaService, "createMediaUrl").and.returnValue(
      `data:[audio/flac];base64,${exampleBase64}`,
    );

    mockTag = new Tag(generateTag(), injector);
    mockSite = new Site(generateSite(), injector);
    mockAudioRecording = new AudioRecording(generateAudioRecording(), injector);

    mockVerificationSummary = [
      new VerificationSummary(
        generateVerificationSummary({
          tagId: mockTag.id,
        }),
      ),
    ];

    mockAnnotation = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
        audioRecordingId: mockAudioRecording.id,
        startTimeSeconds: 0,
        endTimeSeconds: 5,
        tags: [mockTag],
        verificationSummary: mockVerificationSummary,
      }),
      injector,
    );

    audioRecordingApi = spec.inject(AUDIO_RECORDING.token);
    audioRecordingApi.show.andCallFake(() => of(mockAudioRecording));
    audioRecordingApi.filter.andCallFake(() => of([mockAudioRecording]));

    tagApi = spec.inject(TAG.token);
    tagApi.show.andCallFake(() => of(mockTag));
    tagApi.filter.andCallFake(() => of([mockTag]));

    siteApi = spec.inject(SHALLOW_SITE.token);
    siteApi.show.andCallFake(() => of(mockSite));

    siteApi.filter.andCallFake(() => of([mockSite]));

    spec.setInput("annotation", mockAnnotation);
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AnnotationEventCardComponent);
  });

  // TODO: We cannot test defer blocks until ng-mocks supports them.
  // At the moment, they will fail when any ng-mock components are present
  // inside any of the tests.
  // This means that if you just run this test file alone, this test will appear
  // to work, but as soon as you add any other tests that use ng-mocks, this
  // test will begin to fail.
  // see: https://github.com/help-me-mom/ng-mocks/issues/7742
  //
  // xit("should have the correct spectrogram source", async () => {
  //   const deferBlock = (await spectator.fixture.getDeferBlocks())[0];
  //   await deferBlock.render(DeferBlockState.Complete);
  //
  //   const expectedSource = mockAnnotation.audioLink;
  //   const realizedSource = spectrogram().src;
  //   expect(realizedSource).toEqual(expectedSource);
  // });

  it("should have the correct link to the listen page", () => {
    const expectedHref = mockAnnotation.viewUrl;
    expect(listenLink()).toHaveAttribute("href", expectedHref);

    // We use "toHaveExactText" here to ensure there are no extraneous spaces
    // or newlines.
    expect(listenLink()).toHaveExactText("More information");
  });

  it("should display scores correctly", () => {
    const expectedText = mockAnnotation.score?.toString();

    expect(scoreElement()).toHaveExactTrimmedText(expectedText);
    expect(noScoreElement()).not.toExist();
  });

  it("should have the correct content if there is no score", () => {
    mockAnnotation = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
        tags: [mockTag],
        verificationSummary: mockVerificationSummary,
        score: null,
      }),
      injector,
    );

    spec.setInput("annotation", mockAnnotation);

    expect(noScoreElement()).toHaveExactText("No score available");
  });

  xit("should be able to play the spectrogram", () => {});

  describe("tag info", () => {
    it("should have the tag text and link", () => {
      // We use toHaveExactText here instead of toHaveExactTrimmedText because
      // if there is any leading or trailing whitespace, the underline will
      // appear to extend beyond the text, which looks bad.
      expect(tagInfoContainer()).toHaveExactText(mockTag.text);

      const expectedLinks = mockAnnotation.tags.map((tag) => tag.viewUrl);
      expect(tagLinks()).toHaveLength(expectedLinks.length);

      for (const i in expectedLinks) {
        expect(tagLinks()[i]).toHaveUrl(expectedLinks[i]);
      }
    });

    it("should have the correct content if there are no tags", () => {
      mockAnnotation = new Annotation(
        generateAnnotation({
          audioRecording: mockAudioRecording,
          tags: [],
          verificationSummary: [],
        }),
        injector,
      );

      spec.setInput("annotation", mockAnnotation);

      expect(tagInfoContainer()).toHaveExactText("No tags");
      expect(tagLinks()).toHaveLength(0);
    });

    it("should have the correct icon for verified 'correct' tags", () => {
      const verificationSummary = new VerificationSummary(
        generateVerificationSummary({
          tagId: 1,
          count: 1,
          correct: 1,
          incorrect: 0,
          unsure: 0,
          skip: 0,
        }),
      );

      mockAnnotation = new Annotation(
        generateAnnotation({
          audioRecording: mockAudioRecording,
          verificationSummary: [verificationSummary],
          tags: [new Tag(generateTag({ id: 1 }))],
        }),
        injector,
      );

      spec.setInput("annotation", mockAnnotation);

      const icons = tagVerifiedIcons();
      expect(icons).toHaveLength(1);

      const targetIcon = icons[0];
      expect(targetIcon).toHaveIcon(["fas", "circle-check"]);
    });

    it("should have the correct icon for verified 'incorrect' tags", () => {
      const verificationSummary = new VerificationSummary(
        generateVerificationSummary({
          tagId: 1,
          count: 1,
          correct: 0,
          incorrect: 1,
          unsure: 0,
          skip: 0,
        }),
      );

      mockAnnotation = new Annotation(
        generateAnnotation({
          audioRecording: mockAudioRecording,
          verificationSummary: [verificationSummary],
          tags: [new Tag(generateTag({ id: 1 }))],
        }),
        injector,
      );

      spec.setInput("annotation", mockAnnotation);

      const icons = tagVerifiedIcons();
      expect(icons).toHaveLength(1);

      const targetIcon = icons[0];
      expect(targetIcon).toHaveIcon(["fas", "circle-xmark"]);
    });

    it("should have the correct icon for unverified tags", () => {
      const verificationSummary = new VerificationSummary(
        generateVerificationSummary({
          tagId: 1,
          count: 0,
          correct: 0,
          incorrect: 0,
          unsure: 0,
          skip: 0,
        }),
      );

      mockAnnotation = new Annotation(
        generateAnnotation({
          audioRecording: mockAudioRecording,
          verificationSummary: [verificationSummary],
          tags: [new Tag(generateTag({ id: 1 }))],
        }),
        injector,
      );

      spec.setInput("annotation", mockAnnotation);

      const icons = tagVerifiedIcons();
      expect(icons).toHaveLength(1);

      const targetIcon = icons[0];
      expect(targetIcon).toHaveIcon(["fas", "circle"]);
    });

    it("should have the correct icon for low-consensus verified tags", () => {
      const verificationSummary = new VerificationSummary(
        generateVerificationSummary({
          tagId: 1,
          count: 2,
          correct: 1,
          incorrect: 1,
          unsure: 0,
          skip: 0,
        }),
      );

      mockAnnotation = new Annotation(
        generateAnnotation({
          audioRecording: mockAudioRecording,
          verificationSummary: [verificationSummary],
          tags: [new Tag(generateTag({ id: 1 }))],
        }),
        injector,
      );

      spec.setInput("annotation", mockAnnotation);

      const icons = tagVerifiedIcons();
      expect(icons).toHaveLength(1);

      const targetIcon = icons[0];
      expect(targetIcon).toHaveIcon(["fas", "circle-question"]);
    });
  });
});
