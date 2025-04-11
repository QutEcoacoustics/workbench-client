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
    padding: number = 0,
    params: Params = {}
  ): string {
    // check the start and end times are valid
    if (start < 0) {
      throw new Error("Start time must be greater than or equal to 0");
    } else if (end < 0) {
      throw new Error("End time must be greater than or equal to 0");
    } else if (end < start) {
      throw new Error("End time must be greater than start time");
    }

    // check the start and end times fit inside the audio recording
    if (start > audioRecording.durationSeconds) {
      throw new Error(
        "Start time is greater than the duration of the audio recording"
      );
    } else if (end > audioRecording.durationSeconds) {
      throw new Error(
        "End time is greater than the duration of the audio recording"
      );
    }

    // this is here to get around a rounding bug with range requests in the api
    // see: https://github.com/QutEcoacoustics/baw-server/issues/681
    // TODO: remove the rounding patch once the api is fixed
    // TODO: this ceil might result in the audio being rounded to longer than the recording. We should add a condition
    const safeStartTime = Math.floor(start);
    const safeEndTime = Math.ceil(end);

    // the baw-api enforces that split audio recordings must have a minimum
    // duration of 0.5 seconds
    // because it is possible to create events less than 0.5 seconds, we need to
    // pad the start and end times around the audio event to ensure that the
    // split audio is at least 0.5 seconds
    const minimumDuration = 0.05 as const;
    const proposedDuration = safeStartTime - safeEndTime;
    const proposedDifference = proposedDuration - minimumDuration;
    const requiredPaddingAmount = Math.max(proposedDifference, padding);

    const [paddedStart, paddedEnd] = this.padAudioUrl(
      safeStartTime,
      safeEndTime,
      requiredPaddingAmount
    );

    let [fitStart, fitEnd] = this.fitAudioUrl(
      paddedStart,
      paddedEnd,
      audioRecording
    );

    // we round here again so that we get a nice round number
    // we don't have to worry about checks to see if the recording is a minimum
    // length because we only ever add more information when rounding
    //
    // we do however, have to ensure that the end-time is within the bounds of
    // the audio recording
    // to do this, we check if rounded end time would be longer than the
    // duration of the recording. In this case, we have no option but to round
    // round down and add the lost duration to the start time
    fitStart = Math.floor(fitStart);

    const roundedEnd = Math.ceil(fitEnd);
    if (fitEnd + roundedEnd > audioRecording.durationSeconds) {
      const newEnd = Math.floor(fitEnd);
      const subtractedDifference = fitEnd - newEnd;

      // we know that there must be room at the start of the recording
      // because there is a minimum recording time when uploading that is the
      // same length as the minimum split duration
      fitStart -= subtractedDifference;
      fitEnd = newEnd;
    } else {
      fitEnd = roundedEnd;
    }

    let path =
      audioRecording.getMediaUrl(this.apiRoot) +
      `?start_offset=${fitStart}` +
      `&end_offset=${fitEnd}`;

    // if the user is logged in, we want to add their auth token to the
    // query string parameters
    // we do not add the auth token if the user is not logged in because the
    // auth token will be undefined, resulting in `&user_token=undefined`
    if (this.session.authToken) {
      path = this.session.addAuthTokenToUrl(path);
    }

    // add any additional query string parameters
    if (Object.keys(params).length > 0) {
      path += `&${new URLSearchParams(params).toString()}`;
    }

    return path;
  }

  private padAudioUrl(
    start: number,
    end: number,
    padAmount: number = 0
  ): [start: number, end: number] {
    const sidePadding = padAmount / 2;

    start -= sidePadding;
    end += sidePadding;

    return [start, end];
  }

  private fitAudioUrl(
    start: number,
    end: number,
    audioRecording: AudioRecording
  ): [start: number, end: number] {
    if (start < 0) {
      // because we don't want to create fractional start/end times, we need to
      // round up the difference to the nearest whole number
      // we round up to guarantee that the start time is at least 0
      //
      // TODO: remove this ceil once the following api issue is fixed
      // https://github.com/QutEcoacoustics/baw-server/issues/681
      const difference = Math.ceil(Math.abs(start));

      start += difference;
      end += difference;
    }

    const recordingDuration = audioRecording.durationSeconds;
    if (end > recordingDuration) {
      // similar to the start time, we need to round up the difference to the
      // nearest whole number to avoid fractional start/end times
      // we round up to guarantee that the end time is at most the recording
      // duration
      // this might result in some of the end of the audio being cut off
      //
      // TODO: remove this ceil once the following api issue is fixed
      // https://github.com/QutEcoacoustics/baw-server/issues/681
      const difference = Math.ceil(end - recordingDuration);
      start -= difference;
      end -= difference;
    }

    return [start, end];
  }
}
