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
  Creator,
  Updater,
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
  category?: string;
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
  public readonly category?: string;

  // Associations
  // TODO Create AudioRecording association
  @Creator<Bookmark>()
  public creator?: Observable<User>;
  @Updater<Bookmark>()
  public updater?: Observable<User>;

  constructor(bookmark: IBookmark) {
    super(bookmark);
  }

  public listenViewUrl(recordingId: Id, startOffset?: number): string {
    throw new Error("Bookmark listenViewUrl not implemented.");
  }

  public get viewUrl(): string {
    // return `https://www.ecosounds.org/listen/${this.audioRecordingId}?start=${this.offsetSeconds}&end=${???}`;
    throw new Error("Bookmark viewUrl not implemented.");
  }
}
