import { Component, Input } from "@angular/core";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-complete",
  template: `
    <h3>Finished</h3>

    <p>{{ harvest.report.itemsCompleted }} files were successfully added!</p>

    <p>
      {{ harvest.report.itemsFailed + harvest.report.itemsErrored }} files
      failed to be harvested!
    </p>

    <baw-wip>
      <p>
        <a href="/intentionally_broken">
          <fa-icon [icon]="['fas', 'download']"></fa-icon> Download summary of
          harvest
        </a>
      </p>
    </baw-wip>

    <div class="clearfix">
      <a class="btn btn-primary float-end" [strongRoute]="audioRecordingsRoute">
        Show audio files
      </a>
    </div>
  `,
})
export class HarvestCompleteComponent {
  @Input() public harvest: Harvest;

  public audioRecordingsRoute = audioRecordingsRoutes.project;
}
