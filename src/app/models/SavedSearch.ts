import { Injector } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel, Creator, Deleter } from "./AbstractModel";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface ISavedSearch {
  id?: Id;
  name?: Param;
  description?: Description;
  storedQuery?: Filters;
  creatorId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
}

export class SavedSearch extends AbstractModel implements ISavedSearch {
  public readonly kind: "SavedSearches" = "SavedSearches";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  @BawPersistAttr
  public readonly storedQuery?: Filters;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @Creator<SavedSearch>()
  public creator?: Observable<User>;
  @Deleter<SavedSearch>()
  public deleter?: Observable<User>;

  constructor(savedSearches: ISavedSearch, injector?: Injector) {
    super(savedSearches, injector);
  }

  public get viewUrl(): string {
    throw new Error("SavedSearch viewUrl not implemented.");
  }
}
