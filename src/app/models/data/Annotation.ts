import { MEDIA } from "@baw-api/ServiceTokens";
import { annotationMenuItem } from "@components/library/library.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { DateTimeTimezone, Ids } from "@interfaces/apiInterfaces";
import {
  bawDateTime,
  bawSubModelCollection,
} from "@models/AttributeDecorators";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { ITag, Tag } from "@models/Tag";
import { Tagging } from "@models/Tagging";
import { MediaService } from "@services/media/media.service";

export interface IAnnotation extends Required<IAudioEvent> {
  tags: ITag[];
  audioRecording: AudioRecording;
  corrections: Map<Tag["id"], Tagging>;
}

// this class is not backed by the api or a database table
// I have created this model so that we can pass around a single model that
// contains all the information we need about an annotation
//
// this model is created from the AnnotationService and MediaService's
export class Annotation extends AudioEvent implements IAnnotation {
  public readonly kind = "Audio Event";
  public readonly id: number;
  public readonly audioRecordingId: number;
  public readonly startTimeSeconds: number;
  public readonly endTimeSeconds: number;
  public readonly lowFrequencyHertz: number;
  public readonly highFrequencyHertz: number;
  public readonly isReference: boolean;
  public readonly provenanceId: number;
  public readonly score: number;
  public readonly durationSeconds: number;
  public readonly channel: number;
  public readonly audioEventImportFileId: number;

  @bawSubModelCollection(Tag)
  public readonly tags: Tag[];
  public readonly taggings: Tagging[];
  public readonly audioRecording: AudioRecording;

  public readonly creatorId: number;
  public readonly updaterId: number;
  public readonly deleterId: number;

  @bawDateTime()
  public readonly createdAt: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt: DateTimeTimezone;

  public readonly corrections: Map<Tag["id"], Tagging>;

  public get tagIds(): Ids {
    return new Set((this.taggings ?? []).map((tagging) => tagging.tagId));
  }

  public get mediaService(): MediaService {
    return this.injector.get(MEDIA.token);
  }

  public get viewUrl(): string {
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

  public get audioLink(): string {
    return this.mediaService.createMediaUrl(
      this.audioRecording,
      this.startTimeSeconds,
      this.endTimeSeconds,
    );
  }

  public contextUrl(contextSize: number): string {
    return this.mediaService.createMediaUrl(
      this.audioRecording,
      this.startTimeSeconds,
      this.endTimeSeconds,
      contextSize,
    );
  }

  public addCorrection(tag: Tag["id"], tagging: Tagging): void {
    this.corrections.set(tag, tagging);
  }

  public removeCorrection(tag: Tag["id"]): void {
    this.corrections.delete(tag);
  }
}
