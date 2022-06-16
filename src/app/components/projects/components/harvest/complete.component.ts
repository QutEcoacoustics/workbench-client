import { Component, EventEmitter, Input, Output } from "@angular/core";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-complete",
  template: `
    <h3>Finished</h3>

    <p>{{ harvest.report.itemsCompleted }} files were successfully added!</p>

    <p>{{ harvest.report.itemsFailed }} files failed to be harvested!</p>

    <p>{{ harvest.report.itemsErrored }} files caused errors!</p>

    <div class="clearfix">
      <baw-wip>
        <a class="float-start" href="/intentionally_broken">
          <fa-icon [icon]="['fas', 'download']"></fa-icon> Download summary of
          harvest
        </a>
      </baw-wip>
      <a class="btn btn-primary float-end" [strongRoute]="audioRecordingsRoute">
        Show audio files
      </a>
    </div>
  `,
})
export class HarvestCompleteComponent {
  @Input() public harvest: Harvest;

  @Output() public stage = new EventEmitter<HarvestStage>();

  public audioRecordingsRoute = audioRecordingsRoutes.project;
}
