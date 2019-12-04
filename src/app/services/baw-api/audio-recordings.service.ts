import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import {
  AudioRecording,
  AudioRecordingInterface
} from "src/app/models/AudioRecording";
import { APIErrorDetails } from "./base-api.interceptor";
import { Filter } from "./base-api.service";
import { SecurityService } from "./security.service";

@Injectable({
  providedIn: "root"
})
export class AudioRecordingsService extends SecurityService {
  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      filter: "/audio_recordings/filter"
    };
  }

  /**
   * Get list of audio recordings attached to a site ID
   * @param siteId Site ID
   * @param filters Audio recording filter
   */
  public getAudioRecordings(
    siteId: ID,
    filters?: AudioRecordingFilter
  ): Subject<AudioRecording[]> {
    const subject = new Subject<AudioRecording[]>();
    const next = (data: AudioRecordingInterface[]) => {
      subject.next(data.map(recording => new AudioRecording(recording)));
    };
    const error = (err: APIErrorDetails) => {
      subject.error(err);
    };

    this.filter(
      next,
      error,
      this.paths.filter,
      { filters },
      {
        filter: {
          siteId: {
            eq: siteId
          }
        }
      }
    );

    return subject;
  }

  /**
   * Get audio recording
   * @param siteId Site ID
   * @param recordingId Audio Recording ID
   * @param filters Audio recording filter
   */
  public getAudioRecording(
    siteId: ID,
    recordingId: ID,
    filters?: AudioRecordingFilter
  ): Subject<AudioRecording> {
    const subject = new Subject<AudioRecording>();
    const next = (data: AudioRecordingInterface) => {
      subject.next(new AudioRecording(data));
    };
    const error = (err: APIErrorDetails) => {
      subject.error(err);
    };

    this.filter(
      next,
      error,
      this.paths.filter,
      { filters },
      {
        filter: {
          and: {
            siteId: {
              eq: siteId
            },
            id: {
              eq: recordingId
            }
          }
        }
      }
    );

    return subject;
  }
}

/**
 * Audio recording filter
 */
export interface AudioRecordingFilter extends Filter {
  orderBy?:
    | "id"
    | "uuid"
    | "recordedDate"
    | "siteId"
    | "durationSeconds"
    | "sampleRateHertz"
    | "channels"
    | "bitRateBps"
    | "mediaType"
    | "dataLengthBytes"
    | "status"
    | "createdAt"
    | "modifiedAt";
}
