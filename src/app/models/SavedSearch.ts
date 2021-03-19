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
import { creator, deleter } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { User } from "./User";

export interface ISavedSearch extends HasCreatorAndDeleter, HasDescription {
  id?: Id;
  name?: Param;
  storedQuery?: InnerFilter<AudioRecording>;
}

export class SavedSearch
  extends AbstractModel<ISavedSearch>
  implements ISavedSearch {
  public readonly kind = "Saved Search";
  @bawPersistAttr
  public readonly id?: Id;
  @bawPersistAttr
  public readonly name?: Param;
  @bawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawPersistAttr
  public readonly storedQuery?: InnerFilter<AudioRecording>;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @creator<SavedSearch>()
  public creator?: User;
  @deleter<SavedSearch>()
  public deleter?: User;

  public get viewUrl(): string {
    throw new Error("SavedSearch viewUrl not implemented.");
  }
}
