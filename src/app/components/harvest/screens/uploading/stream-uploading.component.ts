import { Component, OnInit } from "@angular/core";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestMapping, IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DecimalPipe } from "@angular/common";
import { UploadUrlComponent } from "../../components/shared/upload-url.component";
import { StrongRouteDirective } from "../../../../directives/strongRoute/strong-route.directive";
import { DatatableDefaultsDirective } from "../../../../directives/datatable/defaults/defaults.directive";
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { ConfirmationComponent } from "../../components/modal/confirmation.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";
import { SafePipe } from "../../../../pipes/safe/safe.pipe";

@Component({
    selector: "baw-harvest-stream-uploading",
    templateUrl: "stream-uploading.component.html",
    imports: [UploadUrlComponent, StrongRouteDirective, NgxDatatableModule, DatatableDefaultsDirective, LoadingComponent, UrlDirective, ConfirmationComponent, DecimalPipe, IsUnresolvedPipe, SafePipe]
})
export class StreamUploadingComponent implements OnInit {
  public active = 1;
  public audioRecordings = audioRecordingMenuItems.list.project;
  public mappings: HarvestMapping[];

  public constructor(
    public modals: NgbModal,
    private stages: HarvestStagesService,
    private config: ConfigService
  ) {}

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public get project(): Project {
    return this.stages.project;
  }

  public get filenameGuide(): string {
    return this.config.settings.links.harvestFilenameGuide;
  }

  public get loading(): boolean {
    return this.stages.transitioningStage;
  }

  public ngOnInit(): void {
    this.mappings = this.stages.harvest.mappings;
    this.stages.startPolling(5000);
  }

  public getMappingUploadUrl(mapping: IHarvestMapping) {
    return this.stages.harvest.uploadUrlWithAuth + "/" + mapping.path;
  }

  public async closeConnection(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("complete");
    }
  }
}
