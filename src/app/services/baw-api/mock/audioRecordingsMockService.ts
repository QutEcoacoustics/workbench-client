import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { AppConfigService } from "../../app-config/app-config.service";
import { AudioRecordingFilters } from "../audio-recordings.service";
import { BawApiService } from "../base-api.service";

@Injectable({
  providedIn: "root"
})
export class MockAudioRecordingsService extends BawApiService {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);
  }

  /**
   * Get list of audio recordings attached to a site ID
   * @param siteId Site ID
   * @param filters Audio recording filter
   */
  public getAudioRecordings(
    siteId: ID,
    filters?: AudioRecordingFilters
  ): Subject<AudioRecording[]> {
    const subject = new Subject<AudioRecording[]>();

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
    filters?: AudioRecordingFilters
  ): Subject<AudioRecording> {
    const subject = new Subject<AudioRecording>();

    return subject;
  }
}
