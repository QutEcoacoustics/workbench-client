import { Injectable } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService,
  ) {}

  public async show(audioEvent: AudioEvent): Promise<Annotation> {
    const audioEventTags = await this.showTags(audioEvent);
    const audioRecording = await this.showAudioRecording(audioEvent);

    const data = {
      ...audioEvent,
      tags: audioEventTags,
      audioRecording,
    };

    return new Annotation(data);
  }

  /**
   * Returns an Annotation model for an audio event that can be verified.
   * This means that there is only one tag.
   * If there are multiple tags, the tag with the highest priority is selected.
   *
   * https://github.com/QutEcoacoustics/workbench-client/issues/2340
   */
  public async showVerificationAnnotation(
    audioEvent: AudioEvent,
    searchParameters: AnnotationSearchParameters,
  ) {
    const tags = await this.showTags(audioEvent);
    const orderedTags = tags.sort((a, b) =>
      searchParameters.tagPriority(b) -
      searchParameters.tagPriority(a),
    );
    const usedTag = orderedTags.length > 0 ? [orderedTags[0]] : [];

    const audioRecording = await this.showAudioRecording(audioEvent);

    const data = {
      ...audioEvent,
      tags: usedTag,
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
