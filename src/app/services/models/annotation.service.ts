import { Injectable } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { MediaService } from "@services/media/media.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService,
    private mediaService: MediaService
  ) {}

  public async show(audioEvent: AudioEvent): Promise<Annotation> {
    const tags = await this.showTags(audioEvent);
    const audioRecording = await this.showAudioRecording(audioEvent);
    const audioLink = this.mediaService.createMediaUrl(
      audioRecording,
      audioEvent.startTimeSeconds,
      audioEvent.endTimeSeconds,
    );

    // TODO: this is a tempoary patch for ecoacoustics/web-components#213
    // until it is fixed upstream
    const tagDescriptor = tags.map((tag) => tag.text).join(", ");

    const data = {
      ...audioEvent,
      tags: tagDescriptor,
      audioLink,
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
      })
    );
  }

  private async showAudioRecording(
    audioEvent: AudioEvent
  ): Promise<AudioRecording> {
    return new AudioRecording(
      await firstValueFrom(
        this.audioRecordingsApi.show(audioEvent.audioRecordingId)
      )
    );
  }
}
