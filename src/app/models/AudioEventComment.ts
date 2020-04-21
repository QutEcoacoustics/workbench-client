import { ACCOUNT } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
import type { User } from "./User";

export interface IAudioEventComment {
  id?: Id;
  audioEventId?: Id;
  comment?: Blob;
  flag?: Flag;
  flagExplain?: Blob;
  flaggerId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  flaggedAt?: DateTimeTimezone | string;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
}

export class AudioEventComment extends AbstractModel
  implements IAudioEventComment {
  public readonly kind: "AudioEventComment" = "AudioEventComment";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioEventId?: Id;
  @BawPersistAttr
  public readonly comment?: Blob;
  @BawPersistAttr
  public readonly flag?: Flag;
  @BawPersistAttr
  public readonly flagExplain?: Blob;
  public readonly flaggerId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly flaggedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @HasOne(ACCOUNT, (m: AudioEventComment) => m.flaggerId)
  public flagger?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioEventComment) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioEventComment) => m.updaterId)
  public updater?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioEventComment) => m.deleterId)
  public deleter?: Observable<User>;

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}

// TODO
type Flag = "??? Anthony";
