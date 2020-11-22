import { Injector } from "@angular/core";
import { InnerFilter } from "@baw-api/baw-api.service";
import {
  DateTimeTimezone,
  Description,
  HasCreatorAndDeleter,
  HasDescription,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, Deleter } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { User } from "./User";

export interface ISavedSearch extends HasCreatorAndDeleter, HasDescription {
  id?: Id;
  name?: Param;
  storedQuery?: InnerFilter<AudioRecording>;
}

export class SavedSearch extends AbstractModel implements ISavedSearch {
  public readonly kind = "Saved Search";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
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

  public constructor(savedSearches: ISavedSearch, injector?: Injector) {
    super(savedSearches, injector);
  }

  public get viewUrl(): string {
    console.error("SavedSearch viewUrl not implement");
    return "not_implemented";
  }
}
