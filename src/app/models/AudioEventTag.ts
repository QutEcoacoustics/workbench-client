import { ACCOUNT, TAG, AUDIO_EVENT } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
import type { Tag } from "./Tag";
import type { User } from "./User";
import type { AudioEvent } from "./AudioEvent";

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
  // TODO Add AudioEvent association
  @HasOne(TAG, (m: AudioEventTag) => m.tagId)
  public tag?: Observable<Tag>;
  @HasOne(ACCOUNT, (m: AudioEventTag) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioEventTag) => m.updaterId)
  public updater?: Observable<User>;
  @HasOne(AUDIO_EVENT, (m: AudioEventTag) => m.audioEventId)
  public audioEvent?: Observable<AudioEvent>;

  constructor(audioEventTag: IAudioEventTag) {
    super(audioEventTag);
  }

  public get viewUrl(): string {
    // AudioEventTag currently has no plans implementing its own view
    throw new Error("AudioEventTag viewUrl not implemented.");
  }
}
