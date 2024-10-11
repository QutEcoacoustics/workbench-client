import { annotationMenuItem } from "@components/library/library.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { IAudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { ITag } from "@models/Tag";
import { ITagging, Tagging } from "@models/Tagging";

export interface IAnnotation extends Required<IAudioEvent> {
  tags: ITag[];
  audioRecording: AudioRecording;
  audioLink: string;
}

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
  public audioLink: string;

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
}
