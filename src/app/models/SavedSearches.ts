import { ACCOUNT } from "@baw-api/ServiceTokens";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
import type { User } from "./User";

export interface ISavedSearches {
  id?: Id;
  name?: Param;
  description?: Description;
  storedQuery?: Blob;
  creatorId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
}

export class SavedSearches extends AbstractModel implements ISavedSearches {
  public readonly kind: "SavedSearches" = "SavedSearches";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  @BawPersistAttr
  public readonly storedQuery?: Blob;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @HasOne(ACCOUNT, (m: SavedSearches) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: SavedSearches) => m.deleterId)
  public deleter?: Observable<User>;

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
