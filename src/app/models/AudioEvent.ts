import {
  AUDIO_EVENT_PROVENANCE,
  AUDIO_RECORDING,
  TAG,
} from "@baw-api/ServiceTokens";
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
import { AudioEventProvenance } from "./AudioEventProvenance";
import { AssociationInjector } from "./ImplementsInjector";

export interface IAudioEvent extends HasAllUsers {
  id?: Id;
  audioRecordingId?: Id;
  channel?: number;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  lowFrequencyHertz?: number;
  highFrequencyHertz?: number;
  durationSeconds?: number;
  isReference?: boolean;
  score?: number;
  taggings?: ITagging[] | Tagging[];
  provenanceId?: Id;
  audioEventImportFileId?: Id;
}

export class AudioEvent
  extends AbstractModel<IAudioEvent>
  implements IAudioEvent
{
  public readonly kind = "Audio Event";
  @bawPersistAttr()
  public readonly audioRecordingId?: Id;
  @bawPersistAttr()
  public readonly channel?: number;
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
  public readonly durationSeconds?: number;
  public readonly score?: number;
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
  public readonly provenanceId?: Id;
  public readonly audioEventImportFileId?: Id;

  // Associations
  @creator<AudioEvent>()
  public creator?: User;
  @updater<AudioEvent>()
  public updater?: User;
  @deleter<AudioEvent>()
  public deleter?: User;
  @hasOne<AudioEvent, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;
  @hasOne<AudioEvent, AudioEventProvenance>(AUDIO_EVENT_PROVENANCE, "provenanceId")
  public provenance?: AudioEventProvenance;
  @hasMany<AudioEvent, Tag>(TAG, "tagIds")
  public tags?: Tag[];

  public constructor(audioEvent: IAudioEvent, injector?: AssociationInjector) {
    super(audioEvent, injector);
    this.taggings = ((audioEvent.taggings ?? []) as ITagging[]).map(
      (tagging) => new Tagging(tagging, injector),
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
      { start: this.startTimeSeconds, padding: 10 },
    );
  }

  public get tagIds(): Ids {
    return new Set((this.taggings ?? []).map((tagging) => tagging.tagId));
  }
}
