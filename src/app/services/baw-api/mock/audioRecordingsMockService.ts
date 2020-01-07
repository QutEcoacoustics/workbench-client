import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AudioRecording } from "src/app/models/AudioRecording";
import { MockModelService } from "./modelMockService";

@Injectable({
  providedIn: "root"
})
export class MockAudioRecordingsService extends MockModelService<
  AudioRecording
> {
  public getAudioRecordings() {
    return new Subject();
  }

  public getAudioRecording() {
    return new Subject();
  }
}
