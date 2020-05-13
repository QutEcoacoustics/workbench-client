import { Injector } from "@angular/core";
import { AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel, Creator, HasOne, Updater } from "./AbstractModel";
import type { AudioRecording } from "./AudioRecording";
import type { User } from "./User";
import { BawPersistAttr, BawDateTime } from "./AttributeDecorators";

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
  @Creator<Bookmark>()
  public creator?: Observable<User>;
  @Updater<Bookmark>()
  public updater?: Observable<User>;
  @HasOne(AUDIO_RECORDING, (m: Bookmark) => m.audioRecordingId)
  public audioRecording?: Observable<AudioRecording>;

  constructor(bookmark: IBookmark, injector?: Injector) {
    super(bookmark, injector);
  }

  public listenViewUrl(recordingId: Id, startOffset?: number): string {
    throw new Error("Bookmark listenViewUrl not implemented.");
  }

  public get viewUrl(): string {
    // return `https://www.ecosounds.org/listen/${this.audioRecordingId}?start=${this.offsetSeconds}&end=${???}`;
    throw new Error("Bookmark viewUrl not implemented.");
  }
}
