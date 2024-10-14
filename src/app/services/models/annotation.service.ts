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
    @Inject(API_ROOT) private apiRoot: string,
  ) {}

  public async buildAnnotation(audioEvent: AudioEvent): Promise<Annotation> {
    const tags = await this.createTags(audioEvent);
    const audioRecording = await this.createAudioRecording(audioEvent);
    const audioLink = this.createAudioLink(audioEvent, audioRecording);

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

  private async createTags(audioEvent: AudioEvent) {
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

  private async createAudioRecording(
    audioEvent: AudioEvent,
  ): Promise<AudioRecording> {
    return new AudioRecording(
      await firstValueFrom(
        this.audioRecordingsApi.show(audioEvent.audioRecordingId),
      ),
    );
  }

  private createAudioLink(
    audioEvent: AudioEvent,
    audioRecording: AudioRecording,
  ): string {
    // this is here to get around a rounding bug with range requests in the api
    // see: https://github.com/QutEcoacoustics/baw-server/issues/681
    // TODO: remove the rounding patch once the api is fixed
    const roundedStartTime = Math.ceil(audioEvent.startTimeSeconds);
    // TODO: check that when rounded the start time doesn't excede the end of
    // the audio file
    let safeEventStartTime = roundedStartTime;

    // if the rounded end time will excede the duration of the audio recording
    // we want to use the duration of the audio recording as the events end
    // we floor the value of the audio recording because rounding up will
    // overflow the audio recordings time, and we need to have a round number
    // to prevent api bugs
    const roundedEndTime = Math.ceil(audioEvent.endTimeSeconds);
    const recordingEndTime = Math.floor(audioRecording.durationSeconds);
    let safeEventEndTime = Math.min(roundedEndTime, recordingEndTime);

    // if the audio event is less than .5 seconds, the api will return an error
    // when trying to split the audio
    // therefore, if we encounter an event that is less than .5 seconds want to
    // pad the audio event until it is .5 seconds long
    const minimumEventDuration = 0.5 as const;
    const eventDuration = safeEventEndTime - roundedStartTime;
    if (eventDuration < minimumEventDuration) {
      const requiredPaddingAmount = minimumEventDuration - eventDuration;
      const safeEventTimes = this.padAudioEvent(
        safeEventStartTime,
        safeEventEndTime,
        requiredPaddingAmount,
        audioRecording,
      );

      safeEventStartTime = safeEventTimes.startTimeSeconds;
      safeEventEndTime = safeEventTimes.endTimeSeconds;
    }

    const basePath =
      `/audio_recordings/${audioEvent.audioRecordingId}/media.flac`;
    let urlParams = `?audio_event_id=${audioEvent.id}` +
      `&start_offset=${safeEventStartTime}&end_offset=${safeEventEndTime}`;

    // if the user is logged in, we want to add their auth token to the
    // query string parameters
    // we do not add the auth token if the user is not logged in because the
    // auth token will be undefined, resulting in `&user_token=undefined`
    if (this.session.authToken) {
      urlParams += `&user_token=${this.session.authToken}`;
    }

    return this.apiRoot + basePath + urlParams;
  }

  private padAudioEvent(
    startTime: number,
    endTime: number,
    padAmount: number,
    audioRecording: AudioRecording,
  ): Required<Pick<AudioEvent, "startTimeSeconds" | "endTimeSeconds">> {
    const sidePadding = padAmount / 2;

    let proposedStartTime = startTime - sidePadding;
    let proposedEndTime = startTime + sidePadding;

    if (proposedStartTime < 0) {
      const difference = Math.abs(proposedStartTime);
      proposedStartTime += difference;
      proposedEndTime += difference;
    }

    const recordingDuration = audioRecording.durationSeconds;
    if (proposedEndTime > recordingDuration) {
      const difference = proposedEndTime - recordingDuration;
      proposedStartTime -= difference;
      proposedEndTime -= difference;
    }

    return {
      startTimeSeconds: proposedStartTime,
      endTimeSeconds: proposedEndTime,
    };
  }
}
