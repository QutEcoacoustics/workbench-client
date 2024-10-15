import { Inject, Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AudioRecording } from "@models/AudioRecording";
import { API_ROOT } from "@services/config/config.tokens";

@Injectable()
export class MediaService {
  public constructor(
    private session: BawSessionService,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  /**
   * Generates a media URL for an audio recording with specified start and end offsets.
   * Optionally includes an authentication token if the user is logged in and additional query parameters.
   *
   * @param audioRecording - The ID of the audio recording.
   * @param start - The start offset in seconds.
   * @param end - The end offset in seconds.
   * @param params - Additional query string parameters.
   * @returns The generated media URL as a string.
   */
  public createMediaUrl(
    audioRecording: AudioRecording,
    start: number,
    end: number,
    params: Params = {},
  ) {
    if (start < 0) {
      throw new Error("Start time must be greater than or equal to 0");
    } else if (end < 0) {
      throw new Error("End time must be greater than or equal to 0");
    } else if (end < start) {
      throw new Error("End time must be greater than start time");
    }

    const minimumDuration = 0.05 as const;
    const proposedDuration = end - start;
    const proposedDifference = proposedDuration - minimumDuration;
    const requiredPaddingAmount = Math.max(proposedDifference, 0);
    const startEndTimes = this.padAudioUrl(
      start,
      end,
      audioRecording,
      requiredPaddingAmount
    );

    // this is here to get around a rounding bug with range requests in the api
    // see: https://github.com/QutEcoacoustics/baw-server/issues/681
    // TODO: remove the rounding patch once the api is fixed
    // TODO: this ceil might result in the audio being rounded to longer than the recording. We should add a condition
    startEndTimes.endTimeSeconds = Math.ceil(startEndTimes.endTimeSeconds);
    startEndTimes.startTimeSeconds = Math.floor(startEndTimes.startTimeSeconds);

    let path =
      `/audio_recordings/${audioRecording.id}/media.flac` +
      `?start_offset=${startEndTimes.startTimeSeconds}` +
      `&end_offset=${startEndTimes.endTimeSeconds}`;

    // if the user is logged in, we want to add their auth token to the
    // query string parameters
    // we do not add the auth token if the user is not logged in because the
    // auth token will be undefined, resulting in `&user_token=undefined`
    if (this.session.authToken) {
      path += `&user_token=${this.session.authToken}`;
    }

    // add any additional query string parameters
    if (Object.keys(params).length > 0) {
      path += `&${new URLSearchParams(params).toString()}`;
    }

    return this.apiRoot + path;
  }

  private padAudioUrl(
    start: number,
    end: number,
    audioRecording: AudioRecording,
    padAmount
  ) {
    const sidePadding = padAmount / 2;

    let proposedStartTime = start - sidePadding;
    let proposedEndTime = end + sidePadding;

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
