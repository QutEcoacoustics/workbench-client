import { Component, EventEmitter, Output } from "@angular/core";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";

@Component({
  selector: "baw-harvest-complete",
  template: `
    <h3>Finished</h3>

    <p>579 files were successfully added!</p>

    <div class="clearfix">
      <a class="float-start" href="/intentionally_broken">
        <fa-icon [icon]="['fas', 'download']"></fa-icon> Download summary of
        harvest
      </a>
      <a class="btn btn-primary float-end" [strongRoute]="audioRecordingsRoute">
        Show audio files
      </a>
    </div>
  `,
})
export class HarvestCompleteComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  public audioRecordingsRoute = audioRecordingsRoutes.project;
}
