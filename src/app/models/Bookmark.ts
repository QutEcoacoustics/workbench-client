import {
  DateTimeTimezone,
  dateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * A bookmark model.
 */
export interface IBookmark {
  id?: Id;
  audioRecordingId?: Id;
  offsetSeconds?: number;
  name?: Param;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  description?: Description;
  category?: Category;
}

export class Bookmark extends AbstractModel implements IBookmark {
  public readonly kind: "Bookmark" = "Bookmark";
  public readonly id?: Id;
  public readonly audioRecordingId?: Id;
  public readonly offsetSeconds?: number;
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly description?: Description;
  public readonly category?: Category;

  constructor(bookmark: IBookmark) {
    super(bookmark);

    this.createdAt = dateTimeTimezone(bookmark.createdAt as string);
    this.updatedAt = dateTimeTimezone(bookmark.updatedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      offsetSeconds: this.offsetSeconds,
      name: this.name,
      description: this.description,
      category: this.category,
    };
  }

  public navigationPath(): string {
    return "/BROKEN_LINK";
    //return `https://www.ecosounds.org/listen/${this.audioRecordingId}?start=${this.offsetSeconds}&end=${???}`;
  }
}

type Category = "<<application>>" | "??? Anthony";
