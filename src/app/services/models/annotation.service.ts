import { Injectable } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation, IAnnotation, TagComparer } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService,
  ) {}

  /**
   * Returns an Annotation model for an audio event that can be verified.
   * This means that there is only one tag.
   * If there are multiple tags, the tag with the highest priority is selected.
   *
   * https://github.com/QutEcoacoustics/workbench-client/issues/2340
   */
  public async show(audioEvent: AudioEvent, tagComparer: TagComparer): Promise<Annotation> {
    const audioRecording = await this.showAudioRecording(audioEvent);
    const audioEventTags = await this.showTags(audioEvent);

    const data: Partial<IAnnotation> = {
      ...audioEvent,
      unsortedTags: audioEventTags,
      tagComparer,
      audioRecording,
    };

    return new Annotation(data);
  }

  private async showTags(audioEvent: AudioEvent): Promise<Tag[]> {
    const tagIds = audioEvent.taggings.map((tagging) => tagging.tagId);
    return await firstValueFrom(
      this.tagsApi.filter({
        filter: {
          id: {
            in: tagIds,
          },
        } as any,
      }),
    );
  }

  private async showAudioRecording(
    audioEvent: AudioEvent,
  ): Promise<AudioRecording> {
    return await firstValueFrom(
      this.audioRecordingsApi.show(audioEvent.audioRecordingId),
    );
  }
}
