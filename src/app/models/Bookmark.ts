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
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
  @BawPersistAttr
  public readonly offsetSeconds?: number;
  @BawPersistAttr
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly description?: Description;
  @BawPersistAttr
  public readonly category?: Category;

  // Associations
  // TODO Create AudioRecording association
  @HasOne(ACCOUNT, (m: Bookmark) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: Bookmark) => m.updaterId)
  public updater?: Observable<User>;

  constructor(bookmark: IBookmark) {
    super(bookmark);
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
    //return `https://www.ecosounds.org/listen/${this.audioRecordingId}?start=${this.offsetSeconds}&end=${???}`;
  }
}

// TODO
type Category = "<<application>>" | "??? Anthony";
