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
import { AudioEventImportFile } from "./AudioEventImportFile";

interface VerificationSummary {
  tagId: Id<Tag>;
  count: number;
  confirmed: number;
  unconfirmed: number;
  unsure: number;
  skip: number;
}

export interface IAudioEvent extends HasAllUsers {
  id?: Id;
  audioRecordingId?: Id<AudioRecording>;
  channel?: number;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  lowFrequencyHertz?: number;
  highFrequencyHertz?: number;
  durationSeconds?: number;
  isReference?: boolean;
  score?: number;
  taggings?: ITagging[] | Tagging[];
  provenanceId?: Id<AudioEventProvenance>;
  audioEventImportFileId?: Id<AudioEventImportFile>;

  // These fields are not included in the standard response, and must be
  // explicitly added via the `projection.add` filter.
  verificationIds?: Ids;
  verificationSummary?: VerificationSummary[];
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
  public readonly provenanceId?: Id;
  public readonly audioEventImportFileId?: Id;

  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;

  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // These fields are not included in the standard response, and must be
  // explicitly added via the `projection.add` filter.
  public readonly verificationIds?: Ids;
  public readonly verificationSummary?: VerificationSummary[];

  // Associations
  @creator()
  public creator?: User;
  @updater()
  public updater?: User;
  @deleter()
  public deleter?: User;
  @hasOne(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;
  @hasOne(AUDIO_EVENT_PROVENANCE, "provenanceId")
  public provenance?: AudioEventProvenance;
  @hasMany(TAG, "tagIds")
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
