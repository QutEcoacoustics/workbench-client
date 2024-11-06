import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { INJECTOR, Injector } from "@angular/core";
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
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { Annotation } from "@models/data/Annotation";
import { generateAnnotation } from "@test/fakes/data/Annotation";
import { MediaService } from "@services/media/media.service";
import { patchSharedArrayBuffer } from "src/patches/tests/testPatches";
import { testAsset } from "@test/helpers/karma";
import { AnnotationEventCardComponent } from "./annotation-event-card.component";

describe("AudioEventCardComponent", () => {
  let spectator: Spectator<AnnotationEventCardComponent>;
  let injectorSpy: SpyObject<Injector>;

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
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    injectorSpy = spectator.inject(INJECTOR);

    mediaServiceSpy = spectator.inject(MEDIA.token);
    mediaServiceSpy.createMediaUrl = jasmine.createSpy("createMediaUrl") as any;
    mediaServiceSpy.createMediaUrl.and.returnValue(
      testAsset("example.flac")
    );

    mockTag = new Tag(generateTag(), injectorSpy);
    mockSite = new Site(generateSite(), injectorSpy);
    mockAudioRecording = new AudioRecording(
      generateAudioRecording(),
      injectorSpy
    );
    mockAnnotation = new Annotation(
      generateAnnotation({
        audioRecording: mockAudioRecording,
        audioRecordingId: mockAudioRecording.id,
        startTimeSeconds: 0,
        endTimeSeconds: 5,
        tags: [mockTag],
      }),
      injectorSpy
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

  const spectrogram = () =>
    spectator.query<SpectrogramComponent>("oe-spectrogram");
  const listenLink = () =>
    spectator.query<HTMLAnchorElement>(".more-information-link");
  const cardTitle = () => spectator.query(".card-title");

  beforeEach(() => {
    patchSharedArrayBuffer();
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationEventCardComponent);
  });

  it("should have the correct spectrogram source", () => {
    const expectedSource = mockAnnotation.audioLink;
    const realizedSource = spectrogram().src;
    expect(realizedSource).toEqual(expectedSource);
  });

  it("should have the correct link to the listen page", () => {
    const expectedHref = mockAnnotation.viewUrl;
    expect(listenLink()).toHaveAttribute("href", expectedHref);
  });

  it("should use the tag text as the card title", () => {
    const expectedTitle = mockTag.text;
    expect(cardTitle()).toHaveText(expectedTitle);
  });

  xit("should be able to play the spectrogram", () => {});
});