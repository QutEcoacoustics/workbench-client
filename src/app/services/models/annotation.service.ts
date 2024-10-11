import { Inject, Injectable } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Annotation } from "@models/data/Annotation";
import { API_ROOT } from "@services/config/config.tokens";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AnnotationService {
  public constructor(
    private tagsApi: TagsService,
    private audioRecordingsApi: AudioRecordingsService,
    private session: BawSessionService,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  public async buildAnnotation(audioEvent: AudioEvent): Promise<Annotation> {
    const tags = await this.createTags(audioEvent);
    const audioRecording = await this.createAudioRecording(audioEvent);
    const audioLink = this.createAudioLink(audioEvent);

    const data = {
      ...audioEvent,
      tags,
      audioLink,
      audioRecording,
    };

    return new Annotation(data);
  }

  private async createTags(audioEvent: AudioEvent) {
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

  private async createAudioRecording(
    audioEvent: AudioEvent
  ): Promise<AudioRecording> {
    return new AudioRecording(
      await firstValueFrom(
        this.audioRecordingsApi.show(audioEvent.audioRecordingId)
      )
    );
  }

  private createAudioLink(audioEvent: AudioEvent): string {
    const basePath = `/audio_recordings/${audioEvent.audioRecordingId}/media.flac`;
    const urlParams =
      `?audio_event_id=${audioEvent.id}` +
      `&end_offset=${audioEvent.endTimeSeconds}&start_offset=${audioEvent.startTimeSeconds}` +
      `&user_token=${this.session.authToken}`;

    return this.apiRoot + basePath + urlParams;
  }
}
