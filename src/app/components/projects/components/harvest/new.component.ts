import { Component, EventEmitter, Output } from "@angular/core";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";

@Component({
  selector: "baw-harvest-new",
  template: `
    <h3>Introduction</h3>

    <p>
      We have a special process for uploading large amounts of audio data into
      our website.
    </p>

    <p>
      For our users, this allows you to submit your recorded environment audio
      for analysis and view the results directly through the website.
    </p>

    <p>Our upload process does several important tasks:</p>

    <ul>
      <li>It converts audio files to formats compatible with our website</li>
      <li>It checks audio files for errors and attempts to repair them</li>
      <li>
        It gathers metadata about the audio (format, channels, bitrate, sample
        rate, duration, etc...) from the files
      </li>
      <li>It lets us chose which site or point audio is added to</li>
    </ul>

    <p>
      This upload process can take a while, but you can pause and resume
      whenever you like. We will guide you through this process.
    </p>

    <p>There are two ways to upload data, either:</p>

    <ol>
      <li>
        As a batch of data you're copying from memory cards or other storage
      </li>
      <li>Streaming uploads from a remote sensor</li>
    </ol>

    <p>Which do you want to do?</p>

    <div class="clearfix d-flex justify-content-center">
      <button
        class="btn btn-outline-primary d-inline me-3"
        (click)="onStreamingUploadClick()"
      >
        Start streaming upload
      </button>
      <button class="btn btn-primary d-inline" (click)="onBatchUploadClick()">
        Upload batch
      </button>
    </div>
  `,
})
export class HarvestNewComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  public onStreamingUploadClick(): void {
    this.stage.emit(HarvestStage.streamUploading);
  }

  public onBatchUploadClick(): void {
    this.stage.emit(HarvestStage.batchUploading);
  }
}
