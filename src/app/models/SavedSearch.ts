import { Injector } from "@angular/core";
import { InnerFilter } from "@baw-api/baw-api.service";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, Deleter } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { User } from "./User";

export interface ISavedSearch {
  id?: Id;
  name?: Param;
  description?: Description;
  storedQuery?: InnerFilter<AudioRecording>;
  creatorId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
}

export class SavedSearch extends AbstractModel implements ISavedSearch {
  public readonly kind = "SavedSearches";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  @BawPersistAttr
  public readonly storedQuery?: InnerFilter<AudioRecording>;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @Creator<SavedSearch>()
  public creator?: User;
  @Deleter<SavedSearch>()
  public deleter?: User;

  public static generate(id?: Id): ISavedSearch {
    return {
      id: modelData.id(id),
      name: modelData.param(),
      description: modelData.description(),
      storedQuery: { uuid: { eq: "blah blah" } }, // TODO Implement with random values
      creatorId: modelData.id(),
      deleterId: modelData.id(),
      createdAt: modelData.timestamp(),
      deletedAt: modelData.timestamp(),
    };
  }

  constructor(savedSearches: ISavedSearch, injector?: Injector) {
    super(savedSearches, injector);
  }

  public get viewUrl(): string {
    throw new Error("SavedSearch viewUrl not implemented.");
  }
}
