import { Injector } from "@angular/core";
import { AUDIO_EVENT, TAG } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
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
  public readonly kind = "Tagging";
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
  @Creator<Tagging>()
  public creator?: User;
  @Updater<Tagging>()
  public updater?: User;
  @HasOne<Tagging>(AUDIO_EVENT, "audioEventId")
  public audioEvent?: AudioEvent;
  @HasOne<Tagging>(TAG, "tagId")
  public tag?: Tag;

  public static generate(id?: Id): ITagging {
    return {
      id: modelData.id(id),
      audioEventId: modelData.id(),
      tagId: modelData.id(),
      creatorId: modelData.id(),
      updaterId: modelData.id(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
    };
  }

  constructor(tagging: ITagging, injector?: Injector) {
    super(tagging, injector);
  }

  public get viewUrl(): string {
    throw new Error("Tagging viewUrl not implemented.");
  }
}
