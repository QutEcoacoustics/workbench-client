import { MEDIA } from "@baw-api/ServiceTokens";
import { annotationMenuItem } from "@components/library/library.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { IAudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { ITag } from "@models/Tag";
import { ITagging, Tagging } from "@models/Tagging";
import { MediaService } from "@services/media/media.service";

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
  public id: number;
  public audioRecordingId: number;
  public startTimeSeconds: number;
  public endTimeSeconds: number;
  public lowFrequencyHertz: number;
  public highFrequencyHertz: number;
  public isReference: boolean;
  public taggings: Tagging[] | ITagging[];
  public provenanceId: number;
  public creatorId: number;
  public createdAt: string | DateTimeTimezone;
  public updaterId: number;
  public updatedAt: string | DateTimeTimezone;
  public deleterId: number;
  public deletedAt: string | DateTimeTimezone;
  public tags: ITag[];
  public audioRecording: AudioRecording;

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
