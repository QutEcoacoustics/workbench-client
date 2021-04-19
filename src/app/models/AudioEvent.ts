import { Injector } from "@angular/core";
import { AUDIO_RECORDING, TAG } from "@baw-api/ServiceTokens";
import { annotationMenuItem } from "@components/library/library.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import {
  DateTimeTimezone,
  HasAllUsers,
  Id,
  Ids,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import {
  creator,
  deleter,
  hasMany,
  hasOne,
  updater,
} from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { Tag } from "./Tag";
import { ITagging, Tagging } from "./Tagging";
import type { User } from "./User";

export interface IAudioEvent extends HasAllUsers {
  id?: Id;
  audioRecordingId?: Id;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  lowFrequencyHertz?: number;
  highFrequencyHertz?: number;
  isReference?: boolean;
  taggings?: ITagging[] | Tagging[];
}

export class AudioEvent
  extends AbstractModel<IAudioEvent>
  implements IAudioEvent {
  public readonly kind = "AudioEvent";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly audioRecordingId?: Id;
  @bawPersistAttr()
  public readonly startTimeSeconds?: number;
  @bawPersistAttr()
  public readonly endTimeSeconds?: number;
  @bawPersistAttr()
  public readonly lowFrequencyHertz?: number;
  @bawPersistAttr()
  public readonly highFrequencyHertz?: number;
  @bawPersistAttr()
  public readonly isReference?: boolean;
  public readonly taggings?: Tagging[];
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  @creator<AudioEvent>()
  public creator?: User;
  @updater<AudioEvent>()
  public updater?: User;
  @deleter<AudioEvent>()
  public deleter?: User;
  @hasOne<AudioEvent, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;
  @hasMany<AudioEvent, Tag>(TAG, "tagIds")
  public tags?: Tag[];

  public constructor(audioEvent: IAudioEvent, injector?: Injector) {
    super(audioEvent, injector);
    this.taggings = ((audioEvent.taggings ?? []) as ITagging[]).map(
      (tagging) => new Tagging(tagging, injector)
    );
  }

  public get viewUrl(): string {
    return this.annotationViewUrl;
  }

  public get annotationViewUrl(): string {
    return annotationMenuItem.route.format({
      audioRecordingId: this.audioRecordingId,
      audioEventId: this.id,
    });
  }

  public get listenViewUrl(): string {
    return listenRecordingMenuItem.route.format(
      { audioRecordingId: this.audioRecordingId },
      { start: this.startTimeSeconds, end: this.endTimeSeconds }
    );
  }

  public get tagIds(): Ids {
    return new Set((this.taggings ?? []).map((tagging) => tagging.tagId));
  }
}
