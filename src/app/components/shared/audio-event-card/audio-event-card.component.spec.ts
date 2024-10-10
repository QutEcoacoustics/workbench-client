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
import { AUDIO_RECORDING, SHALLOW_SITE, TAG } from "@baw-api/ServiceTokens";
import { of } from "rxjs";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { AudioEvent } from "@models/AudioEvent";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { AudioEventCardComponent } from "./audio-event-card.component";

describe("AudioEventCardComponent", () => {
  let spectator: Spectator<AudioEventCardComponent>;
  let injectorSpy: SpyObject<Injector>;
  let audioRecordingApiSpy: SpyObject<AudioRecordingsService>;
  let tagApiSpy: SpyObject<TagsService>;
  let siteApiSpy: SpyObject<ShallowSitesService>;

  let mockAudioEvent: AudioEvent;
  let mockAudioRecording: AudioRecording;
  let mockTag: Tag;
  let mockSite: Site;

  const createComponent = createComponentFactory({
    component: AudioEventCardComponent,
    imports: [MockBawApiModule, SharedModule],
  });

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    injectorSpy = spectator.inject(INJECTOR);

    mockAudioEvent = new AudioEvent(generateAudioEvent(), injectorSpy);
    mockTag = new Tag(generateTag(), injectorSpy);
    mockSite = new Site(generateSite(), injectorSpy);
    mockAudioRecording = new AudioRecording(
      generateAudioRecording(),
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

    spectator.setInput("audioEvent", mockAudioEvent);
  }

  const spectrogram = () =>
    spectator.query<SpectrogramComponent>("oe-spectrogram");
  const listenLink = () =>
    spectator.query<HTMLAnchorElement>(".more-information-link");
  const cardTitle = () => spectator.query(".card-title");

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AudioEventCardComponent);
  });

  it("should have the correct spectrogram source", () => {
    const expectedSource = mockAudioEvent.audioLink;
    const realizedSource = spectrogram().src;
    expect(realizedSource).toEqual(expectedSource);
  });

  it("should have the correct link to the listen page", () => {
    const expectedHref = mockAudioEvent.viewUrl;
    expect(listenLink()).toHaveAttribute("href", expectedHref);
  });

  it("should use the tag text as the card title", () => {
    const expectedTitle = mockTag.text;
    expect(cardTitle()).toHaveText(expectedTitle);
  });

  xit("should be able to play the spectrogram", () => {});
});
