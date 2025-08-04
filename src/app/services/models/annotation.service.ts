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
      this.tagPriority(b, searchParameters) -
      this.tagPriority(a, searchParameters),
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

  /**
   * Assigns a tag a numerical priority specifying how relevant the tag is to
   * the search parameters.
   *
   * 0. A priority set by a user (e.g. PE wants to specify that a particular
   *    call variant tag should be verified)
   *
   * 1. the tag which matches any tag used to filter the current dataset
   *    e.g. if we're searching for "Powerful Owl" then the tag "Powerful Owl"
   *    should be prioritized from the tag list "Powerful Owl Alarm Call,
   *    Ninoxboobook, Powerful Owl"
   *
   * 2. The first common_name tag
   *
   * 3. The first species_name tag
   *
   * 4. In the worst case: the first remaining tag that does not match any of
   *    those conditions.
   */
  private tagPriority(tag: Tag, searchParameters: AnnotationSearchParameters): number {
    if (tag.id === searchParameters.taskTag) {
      return 0;
    }

    if (Array.from(searchParameters.tags).includes(tag.id)) {
      return 1;
    }

    if (tag) {
      return 2;
    }

    if (tag.typeOfTag === "common_name") {
      return 3;
    }

    if (tag.typeOfTag === "species_name") {
      return 4;
    }

    return 5;
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
