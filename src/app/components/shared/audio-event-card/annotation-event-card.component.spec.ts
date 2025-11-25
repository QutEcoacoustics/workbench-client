import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { AudioRecording } from "@models/AudioRecording";
import { Tag } from "@models/Tag";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { generateTag } from "@test/fakes/Tag";
import {
  AUDIO_RECORDING,
  MEDIA,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { of } from "rxjs";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { MediaService } from "@services/media/media.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { IconsModule } from "@shared/icons/icons.module";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { exampleBase64 } from "src/test-assets/example-0.5s.base64";
import { provideRouter } from "@angular/router";
import { AnnotationEventCardComponent } from "./annotation-event-card.component";

describe("AnnotationEventCardComponent", () => {
  let spectator: Spectator<AnnotationEventCardComponent>;
  let injectorSpy: SpyObject<AssociationInjector>;

  let mediaServiceSpy: SpyObject<MediaService>;
  let audioRecordingApiSpy: SpyObject<AudioRecordingsService>;
  let tagApiSpy: SpyObject<TagsService>;
  let siteApiSpy: SpyObject<ShallowSitesService>;

  let mockAnnotation: Annotation;
  let mockAudioRecording: AudioRecording;
  let mockTag: Tag;
  let mockSite: Site;

  const createComponent = createComponentFactory({
    component: AnnotationEventCardComponent,
    imports: [IconsModule],
    providers: [provideMockBawApi(), provideRouter([])],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    injectorSpy = spectator.inject(ASSOCIATION_INJECTOR);

    mediaServiceSpy = spectator.inject(MEDIA.token);
    spyOn(mediaServiceSpy, "createMediaUrl").and.returnValue(
      `data:[audio/flac];base64,${exampleBase64}`,
    );

    mockTag = new Tag(generateTag(), injectorSpy);
    mockSite = new Site(generateSite(), injectorSpy);
    mockAudioRecording = new AudioRecording(
      generateAudioRecording(),
      injectorSpy,
    );
    mockAnnotation = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
        audioRecordingId: mockAudioRecording.id,
        startTimeSeconds: 0,
        endTimeSeconds: 5,
        tags: [mockTag],
      }),
      injectorSpy,
    );

    audioRecordingApiSpy = spectator.inject(AUDIO_RECORDING.token);
    audioRecordingApiSpy.show.andCallFake(() => of(mockAudioRecording));
    audioRecordingApiSpy.filter.andCallFake(() => of([mockAudioRecording]));

    tagApiSpy = spectator.inject(TAG.token);
    tagApiSpy.show.andCallFake(() => of(mockTag));
    tagApiSpy.filter.andCallFake(() => of([mockTag]));

    siteApiSpy = spectator.inject(SHALLOW_SITE.token);
    siteApiSpy.show.andCallFake(() => of(mockSite));

    siteApiSpy.filter.andCallFake(() => of([mockSite]));

    spectator.setInput("annotation", mockAnnotation);
  }

  // const spectrogram = () =>
  //   spectator.query<SpectrogramComponent>("oe-spectrogram");
  const listenLink = () =>
    spectator.query<HTMLAnchorElement>(".more-information-link");
  const tagInfoElement = () => spectator.query(".tag-information");

  const scoreElement = () => spectator.query(".tag-score");
  const noScoreElement = () => spectator.query(".no-score-placeholder");

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationEventCardComponent);
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

  it("should have the tag text and link in the info", () => {
    const expectedText = mockTag.text;
    expect(tagInfoElement()).toHaveText(expectedText);
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
        score: null,
      }),
      injectorSpy,
    );

    spectator.setInput("annotation", mockAnnotation);

    expect(noScoreElement()).toHaveExactText("No score available");
  });

  xit("should be able to play the spectrogram", () => {});
});
