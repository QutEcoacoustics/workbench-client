import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BawApiService } from "../base-api.service";

@Injectable({
  providedIn: "root"
})
export class MockAudioRecordingsService extends BawApiService {
  public getAudioRecordings() {
    return new Subject();
  }

  public getAudioRecording() {
    return new Subject();
  }
}
