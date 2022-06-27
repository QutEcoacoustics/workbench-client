import { Component, OnInit } from "@angular/core";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestMapping, IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";

@Component({
  selector: "baw-harvest-stream-uploading",
  templateUrl: "stream-uploading.component.html",
})
export class StreamUploadingComponent implements OnInit {
  public loading: boolean;
  public active = 1;
  public audioRecordings = audioRecordingMenuItems.list.project;
  public mappings: HarvestMapping[];

  public constructor(private stages: HarvestStagesService) {}

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public get project(): Project {
    return this.stages.project;
  }

  public ngOnInit(): void {
    // TODO If mapping updates are possible after the initial load, we may want
    // to check for changes whenever harvest is updated
    this.mappings = this.stages.harvest.mappings;
    this.stages.startPolling(5000);
  }

  public getMappingUploadUrl(mapping: IHarvestMapping) {
    return this.stages.harvest.uploadUrlWithAuth + "/" + mapping.path;
  }

  public closeConnectionClick(): void {
    this.loading = true;
    this.stages.transition("complete", () => (this.loading = false));
  }
}
