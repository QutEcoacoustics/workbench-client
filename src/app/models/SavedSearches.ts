import {
  Id,
  Param,
  Description,
  DateTimeTimezone,
  dateTimeTimezone,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

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
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly description?: Description;
  public readonly storedQuery?: Blob;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly deletedAt?: DateTimeTimezone;

  constructor(savedSearches: ISavedSearches) {
    super(savedSearches);

    this.createdAt = dateTimeTimezone(savedSearches.createdAt as string);
    this.deletedAt = dateTimeTimezone(savedSearches.deletedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      storedQuery: this.storedQuery,
    };
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
