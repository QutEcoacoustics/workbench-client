import { AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import {
  DateTimeTimezone,
  Description,
  HasCreatorAndUpdater,
  HasDescription,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne, updater } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { User } from "./User";

/**
 * A bookmark model.
 */
export interface IBookmark extends HasCreatorAndUpdater, HasDescription {
  id?: Id;
  audioRecordingId?: Id;
  offsetSeconds?: number;
  name?: Param;
  category?: string;
}

export class Bookmark extends AbstractModel<IBookmark> implements IBookmark {
  public readonly kind = "Bookmark";
  @bawPersistAttr
  public readonly id?: Id;
  @bawPersistAttr
  public readonly audioRecordingId?: Id;
  @bawPersistAttr
  public readonly offsetSeconds?: number;
  @bawPersistAttr
  public readonly name?: Param;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawPersistAttr
  public readonly category?: string;

  // Associations
  @creator<Bookmark>()
  public creator?: User;
  @updater<Bookmark>()
  public updater?: User;
  @hasOne<Bookmark, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  public get viewUrl(): string {
    return listenRecordingMenuItem.route.format(
      { audioRecordingId: this.audioRecordingId },
      { start: this.offsetSeconds }
    );
  }
}
