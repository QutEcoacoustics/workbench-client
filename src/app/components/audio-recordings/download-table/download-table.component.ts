import { Component, Input } from "@angular/core";
import { AudioRecording } from "@models/AudioRecording";
import { Observable } from "rxjs";

@Component({
  selector: "baw-download-table",
  template: `
    <ng-container *ngIf="recordings$ | withLoading | async as recordings">
      <baw-loading *ngIf="recordings.loading"></baw-loading>

      <pre *ngIf="recordings.error">{{ recordings.error | json }}</pre>

      <p *ngIf="recordings.value">
        Number of Recordings Selected:
        {{ getNumberOfRecordings(recordings.value) }}
      </p>
      <!--
        <p *ngIf="recordings.value">
        Newest (in current page): {{ getNewestRecording(recordings.value) }}
      </p>
      <p *ngIf="recordings.value">
        Oldest (in current page): {{ getOldestRecording(recordings.value) }}
      </p>
      <pre *ngIf="recordings.value">{{ recordings.value | json }}</pre>
      -->
    </ng-container>
  `,
})
export class DownloadTableComponent {
  @Input() public recordings$: Observable<AudioRecording[]>;

  public getNumberOfRecordings(recordings: AudioRecording[]): number {
    if (recordings.length === 0) {
      return 0;
    }
    return recordings[0].getMetadata().paging.total;
  }

  public getNewestRecording(recordings: AudioRecording[]): string {
    if (recordings.length === 0) {
      return "No recordings";
    }

    return recordings
      .reduce((a, b) => (a.recordedDate > b.recordedDate ? a : b))
      .recordedDate.toFormat("yyyy-MM-dd hh:mm:ss");
  }

  public getOldestRecording(recordings: AudioRecording[]): string {
    if (recordings.length === 0) {
      return "No recordings";
    }

    return recordings
      .reduce((a, b) => (a.recordedDate < b.recordedDate ? a : b))
      .recordedDate.toFormat("yyyy-MM-dd hh:mm:ss");
  }
}
