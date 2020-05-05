import { ACCOUNT, TAG } from "@baw-api/ServiceTokens";
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

  constructor(audioEventTag: IAudioEventTag) {
    super(audioEventTag);
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
