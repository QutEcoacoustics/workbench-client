import { Injector } from "@angular/core";
import { AUDIO_EVENT, TAG } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel, Creator, HasOne, Updater } from "./AbstractModel";
import { BawPersistAttr } from "./AttributeDecorators";
import type { AudioEvent } from "./AudioEvent";
import type { Tag } from "./Tag";
import type { User } from "./User";

export interface ITagging {
  id?: Id;
  audioEventId?: Id;
  tagId?: Id;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

export class Tagging extends AbstractModel implements ITagging {
  public readonly kind: "Tagging" = "Tagging";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioEventId?: Id;
  @BawPersistAttr
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Tagging>()
  public creator?: Observable<User>;
  @Updater<Tagging>()
  public updater?: Observable<User>;
  @HasOne(AUDIO_EVENT, (m: Tagging) => m.audioEventId)
  public audioEvent?: Observable<AudioEvent>;
  @HasOne(TAG, (m: Tagging) => m.tagId)
  public tag?: Observable<Tag>;

  constructor(tagging: ITagging, injector?: Injector) {
    super(tagging, injector);
  }

  public get viewUrl(): string {
    throw new Error("Tagging viewUrl not implemented.");
  }
}
