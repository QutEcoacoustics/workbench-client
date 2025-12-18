import {
  AUDIO_EVENT_PROVENANCE,
  AUDIO_RECORDING,
  TAG,
} from "@baw-api/ServiceTokens";
import { annotationMenuItem } from "@components/library/library.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import {
  CollectionIds,
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
import {
  bawDateTime,
  bawPersistAttr,
  bawSubModelCollection,
} from "./AttributeDecorators";
import {
  IVerificationSummary,
  VerificationSummary,
} from "./AudioEvent/VerificationSummary";
import { AudioEventImportFile } from "./AudioEventImportFile";
import type { AudioRecording } from "./AudioRecording";
import { AssociationInjector } from "./ImplementsInjector";
import { Provenance } from "./Provenance";
import type { Tag } from "./Tag";
import { ITagging, Tagging } from "./Tagging";
import type { User } from "./User";

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
  provenanceId?: Id<Provenance>;
  audioEventImportFileId?: Id<AudioEventImportFile>;

  // These fields are not included in the standard response, and must be
  // explicitly added via the `projection.add` filter.
  //
  // TODO: Improve these typings once we refactor how abstract models interact
  // with projections and non-default fields.
  // see: https://github.com/QutEcoacoustics/workbench-client/issues/2556
  verificationIds?: CollectionIds;
  verificationSummary?: IVerificationSummary[];
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
  public readonly verificationIds?: CollectionIds;

  @bawSubModelCollection(VerificationSummary)
  public readonly verificationSummary: VerificationSummary[];

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
  public provenance?: Provenance;
  @hasMany(TAG, "tagIds")
  public tags?: Tag[];

  public constructor(audioEvent: IAudioEvent, injector?: AssociationInjector) {
    super(audioEvent, injector);
    this.taggings = ((audioEvent.taggings ?? []) as ITagging[]).map(
      (tagging) => new Tagging(tagging, injector),
    );

    // The verificationSummary has some bugs that need to be worked around
    // client side.
    // To make it easy to use this model, all of the bugs are handled here so
    // hopefully you can use the verificationSummary property without worrying
    // about these issues.
    //
    // Warning: that these fixes ALWAYS add a verificationSummary for every tag
    // and the verificationSummary is NOT a part of the standard audio event
    // response, meaning that if you did not explicitly request the
    // verificationSummary to be included via a projection filter, these fixes
    // will always add a fully zeroed verification summary for every tag.
    //
    // If there are no verifications on the audio event, the server will return
    // "null" for the verification summary instead of an empty array.
    // Therefore, we handle this case here by converting values null to an empty
    // array.
    //
    // see: https://github.com/QutEcoacoustics/baw-server/issues/869
    if (!this.verificationSummary) {
      this.verificationSummary = [];
    }

    // Tags that do not have any verifications do not show up in the
    // verification summary returned by the server.
    // This means that you can have a partially complete verification summary
    // if some tags have verifications and others do not.
    // Therefore, we need to fill in any missing tags with an empty "default"
    // verification summary with all zero counts.
    //
    // see: https://github.com/QutEcoacoustics/baw-server/issues/869
    const tagIds = this.tagIds ?? [];
    for (const tagId of tagIds) {
      const hasSummary = this.verificationSummary.some(
        (summary) => summary.tagId === tagId,
      );

      if (hasSummary) {
        continue;
      }

      const defaultSummary = new VerificationSummary({
        tagId,
        count: 0,
        correct: 0,
        incorrect: 0,
        unsure: 0,
        skip: 0,
      });

      this.verificationSummary.push(defaultSummary);
    }
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
