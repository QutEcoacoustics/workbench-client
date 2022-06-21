import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  harvestsCategory,
  newHarvestMenuItem,
} from "@components/harvest/harvest.menus";
import { harvestRoute } from "@components/harvest/harvest.routes";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Harvest, IHarvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";

const projectKey = "project";

@Component({
  selector: "baw-harvest-new",
  template: `
    <!-- TODO Extract title to shared component -->
    <h1>
      <small class="text-muted"> Project: {{ project.name }} </small>
      <br />
      Upload Recordings
    </h1>

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
        [disabled]="loading"
        (click)="onStreamingUploadClick()"
      >
        Start streaming upload
      </button>
      <button
        class="btn btn-primary d-inline"
        [disabled]="loading"
        (click)="onBatchUploadClick()"
      >
        Upload batch
      </button>
    </div>
  `,
})
class NewComponent extends PageComponent implements OnInit {
  public loading: boolean;
  public project: Project;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifications: ToastrService,
    private harvestApi: HarvestsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
  }

  public onStreamingUploadClick(): void {
    this.createHarvest({ streaming: true });
  }

  public onBatchUploadClick(): void {
    this.createHarvest({ streaming: false });
  }

  private createHarvest(body: IHarvest) {
    this.loading = true;

    // We want this api request to complete regardless of component destruction
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi.create(new Harvest(body), this.project).subscribe({
      next: (harvest): void => {
        this.loading = false;
        this.router.navigateByUrl(
          harvestRoute.toRouterLink({
            projectId: this.project.id,
            harvestId: harvest.id,
          })
        );
      },
      error: (err: BawApiError): void => {
        this.loading = false;

        if (err.info?.project) {
          // Project has not enabled audio uploading
          this.notifications.error(err.info.project as string);
        } else {
          this.notifications.error(err.message);
        }
      },
    });
  }
}

NewComponent.linkToRoute({
  category: harvestsCategory,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  pageRoute: newHarvestMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { NewComponent };
