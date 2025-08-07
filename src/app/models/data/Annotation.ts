import { MEDIA } from "@baw-api/ServiceTokens";
import { annotationMenuItem } from "@components/library/library.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { bawSubModelCollection } from "@models/AttributeDecorators";
import { IAudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { ITag, Tag } from "@models/Tag";
import { ITagging, Tagging } from "@models/Tagging";
import { MediaService } from "@services/media/media.service";

export type TagComparer = (a: Tag, b: Tag) => number;

export interface IAnnotation extends Required<IAudioEvent> {
  tags: ITag[];
  audioRecording: AudioRecording;
}

// this class is not backed by the api or a database table
// I have created this model so that we can pass around a single model that
// contains all the information we need about an annotation
//
// this model is created from the AnnotationService and MediaService's
export class Annotation extends AbstractModelWithoutId implements IAnnotation {
  public readonly id: number;
  public readonly audioRecordingId: number;
  public readonly startTimeSeconds: number;
  public readonly endTimeSeconds: number;
  public readonly lowFrequencyHertz: number;
  public readonly highFrequencyHertz: number;
  public readonly isReference: boolean;
  public readonly taggings: Tagging[] | ITagging[];
  public readonly provenanceId: number;
  public readonly creatorId: number;
  public readonly createdAt: string | DateTimeTimezone;
  public readonly updaterId: number;
  public readonly updatedAt: string | DateTimeTimezone;
  public readonly deleterId: number;
  public readonly deletedAt: string | DateTimeTimezone;
  @bawSubModelCollection(Tag)
  public readonly tags: Tag[];
  public readonly audioRecording: AudioRecording;
  public readonly score: number;
  public readonly durationSeconds: number;
  public readonly channel: number;
  public readonly audioEventImportFileId: number;

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
      { start: this.startTimeSeconds, padding: 10 }
    );
  }

  public get audioLink(): string {
    return this.mediaService.createMediaUrl(
      this.audioRecording,
      this.startTimeSeconds,
      this.endTimeSeconds
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
}
