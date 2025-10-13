import { Injectable } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation, IAnnotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { Tagging } from "@models/Tagging";
import { firstValueFrom } from "rxjs";

export type TagComparer = (a: Tag, b: Tag) => number;

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService,
  ) {}

  public async show(audioEvent: AudioEvent, priorityTags: Id[]): Promise<Annotation> {
    const audioRecording = await this.showAudioRecording(audioEvent);
    const audioEventTags = await this.showTags(audioEvent);

    const tagComparer = this.makeTagComparer(priorityTags);
    const tags = audioEventTags.sort(tagComparer);

    const data = {
      ...audioEvent,
      tags,
      audioRecording,
      corrections: new Map<Id<Tag>, Tagging>(),
    } as IAnnotation;

    return new Annotation(data);
  }

  private makeTagComparer(tagPriority: Id[]): TagComparer {
    return (a: Tag, b: Tag): number => {
      const aPriority = this.tagPriority(a, tagPriority);
      const bPriority = this.tagPriority(b, tagPriority);

      // If the values have the same priority, we simply return 0 to maintain
      // the order of tag priorities.
      // This means that tags that appear sooner in the tag priority list will
      // be preferred when there is a tie in priority.
      return bPriority - aPriority;
    }
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

  private tagPriority(tag: Tag, priorityTags: Id[]): number {
    const priorityTagCount = priorityTags.length;

    /**
     * Assigns a tag a numerical priority specifying how relevant the tag is to
     * the search parameters.
     *
     * 5. A priority set by a user (e.g. PE wants to specify that a particular
     *    call variant tag should be verified)
     *
     * 4. the tag which matches any tag used to filter the current dataset
     *    e.g. if we're searching for "Powerful Owl" then the tag "Powerful Owl"
     *    should be prioritized from the tag list "Powerful Owl Alarm Call,
     *    Ninoxboobook, Powerful Owl"
     *
     * 3. The first common_name tag
     *
     * 2. The first species_name tag
     *
     * 1. In the worst case: the first remaining tag that does not match any of
     *    those conditions.
     *
     * A higher value means a the tag is more specific to the current search.
     */
    const priorityTagIndex = priorityTags.indexOf(tag.id);
    if (priorityTagIndex !== -1) {
      // tags early in the priority list are more specific
      return 4 + (priorityTagCount - priorityTagIndex);
    }

    if (tag.typeOfTag === "common_name") {
      return 3;
    }

    if (tag.typeOfTag === "species_name") {
      return 2;
    }

    return 1;
  }
}
