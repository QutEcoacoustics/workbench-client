import { Injector } from "@angular/core";
import { AUDIO_EVENT, TAG } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel, Creator, HasOne, Updater } from "./AbstractModel";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { AudioEvent } from "./AudioEvent";
import type { Tag } from "./Tag";
import type { User } from "./User";

export interface IAudioEventTag {
  id?: Id;
  audioEventId?: Id;
  tagId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class AudioEventTag extends AbstractModel implements IAudioEventTag {
  public readonly kind: "AudioEventTag" = "AudioEventTag";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioEventId?: Id;
  @BawPersistAttr
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<AudioEventTag>()
  public creator: Observable<User>;
  @Updater<AudioEventTag>()
  public updater?: Observable<User>;
  @HasOne(TAG, (m: AudioEventTag) => m.tagId)
  public tag?: Observable<Tag>;
  @HasOne(AUDIO_EVENT, (m: AudioEventTag) => m.audioEventId)
  public audioEvent?: Observable<AudioEvent>;

  constructor(audioEventTag: IAudioEventTag, injector?: Injector) {
    super(audioEventTag, injector);
  }

  public get viewUrl(): string {
    // AudioEventTag currently has no plans implementing its own view
    throw new Error("AudioEventTag viewUrl not implemented.");
  }
}
