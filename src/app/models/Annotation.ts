import { Injector } from "@angular/core";
import {
  AUDIO_EVENT_TAG,
  AUDIO_RECORDING,
  SHALLOW_AUDIO_EVENT,
  SHALLOW_SITE,
  TAG,
} from "@baw-api/ServiceTokens";
import { Id } from "@interfaces/apiInterfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { AbstractModel } from "./AbstractModel";
import type { AudioEvent } from "./AudioEvent";
import type { AudioEventTag } from "./AudioEventTag";
import type { AudioRecording } from "./AudioRecording";
import type { Site } from "./Site";
import type { Tag } from "./Tag";

export interface IAnnotation {
  id: Id;
  audioEvent: Observable<AudioEvent>;
  audioEventTags: Observable<AudioEventTag[]>;
  tags: Observable<Tag[]>;
  audioRecording: Observable<AudioRecording>;
  site: Observable<Site>;
}

export class Annotation extends AbstractModel implements IAnnotation {
  public readonly kind: "Annotation" = "Annotation";
  public id: Id;
  private _audioEvent?: Observable<AudioEvent>;
  private _audioEventTags?: Observable<AudioEventTag[]>;
  private _tags?: Observable<Tag[]>;
  private _audioRecording?: Observable<AudioRecording>;
  private _site?: Observable<Site>;

  constructor(audioEvent: AudioEvent, injector: Injector) {
    super({ id: audioEvent.id }, injector);
    this._audioEvent = new BehaviorSubject<AudioEvent>(audioEvent);
  }

  public get audioEvent(): Observable<AudioEvent> {
    if (this._audioEvent) {
      return this._audioEvent;
    }

    const api = this.injector.get(SHALLOW_AUDIO_EVENT.token);

    this._audioEvent = api.show(this.id).pipe(
      map((audioEvent) => {
        this._audioEvent = new BehaviorSubject<AudioEvent>(audioEvent);
        return audioEvent;
      })
    );
    return this.audioEvent;
  }

  public get audioEventTags(): Observable<AudioEventTag[]> {
    if (this._audioEventTags) {
      return this._audioEventTags;
    }

    const api = this.injector.get(AUDIO_EVENT_TAG.token);

    this._audioEventTags = this.audioEvent.pipe(
      flatMap((audioEvent) =>
        api.filter(
          { filter: { audioEventId: { eq: audioEvent.id } } },
          audioEvent.audioRecordingId,
          audioEvent.id
        )
      ),
      map((audioEventTags) => {
        this._audioEventTags = new BehaviorSubject<AudioEventTag[]>(
          audioEventTags
        );
        return audioEventTags;
      })
    );

    return this.audioEventTags;
  }

  public get tags(): Observable<Tag[]> {
    if (this._tags) {
      return this._tags;
    }

    const api = this.injector.get(TAG.token);

    this._tags = this.audioEventTags.pipe(
      flatMap((eventTags) =>
        api.filter({
          paging: { items: 100 },
          filter: { id: { in: eventTags.map((model) => model.tagId) } },
        })
      ),
      map((tags) => {
        this._tags = new BehaviorSubject<Tag[]>(tags);
        return tags;
      })
    );
    return this.tags;
  }

  public get audioRecording(): Observable<AudioRecording> {
    if (this._audioRecording) {
      return this._audioRecording;
    }

    const api = this.injector.get(AUDIO_RECORDING.token);

    this._audioRecording = this.audioEvent.pipe(
      flatMap((audioEvent) => api.show(audioEvent.audioRecordingId)),
      map((audioRecording) => {
        this._audioRecording = new BehaviorSubject<AudioRecording>(
          audioRecording
        );
        return audioRecording;
      })
    );
    return this.audioRecording;
  }

  public get site(): Observable<Site> {
    if (this._site) {
      return this._site;
    }

    const api = this.injector.get(SHALLOW_SITE.token);

    this._site = this.audioRecording.pipe(
      flatMap((audioRecording) =>
        api.filter({ filter: { id: { eq: audioRecording.siteId } } })
      ),
      map((sites) => {
        const site = sites.length > 0 ? sites[0] : null;
        this._site = new BehaviorSubject<Site>(site);
        return site;
      })
    );
    return this.site;
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
