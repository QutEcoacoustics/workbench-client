import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { contactUsMenuItem } from "@components/about/about.menus";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { myAccountMenuItem } from "@components/profile/profile.menus";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { filterModel } from "@helpers/filters/filters";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { StrongRoute } from "@interfaces/strongRoute";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { licenseWidgetMenuItem } from "@menu/widget.menus";
import { WidgetMenuItem } from "@menu/widgetItem";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeFilterComponent } from "@shared/date-time-filter/date-time-filter.component";
import { HiddenCopyComponent } from "@shared/hidden-copy/hidden-copy.component";
import { List } from "immutable";
import { BehaviorSubject, takeUntil } from "rxjs";
import { loginMenuItem } from "src/app/components/security/security.menus";
import { DownloadTableComponent } from "../../components/download-table/download-table.component";
import { SitesWithoutTimezonesComponent } from "../../components/sites-without-timezones/sites-without-timezones.component";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-download",
  templateUrl: "download.component.html",
  imports: [
    SitesWithoutTimezonesComponent,
    FormsModule,
    DateTimeFilterComponent,
    DownloadTableComponent,
    StrongRouteDirective,
    HiddenCopyComponent,
  ],
})
class DownloadAudioRecordingsComponent extends PageComponent implements OnInit {
  @ViewChild(NgForm) public form: NgForm;

  public filters$: BehaviorSubject<Filters<AudioRecording>> =
    new BehaviorSubject({});

  public contactUs = contactUsMenuItem;
  public href = "";
  public models: ResolvedModelList;
  public profile = myAccountMenuItem;
  public hoveredDate: NgbDate;

  public errors: {
    todBoundaryError?: boolean;
  } = {};

  public constructor(
    public session: BawSessionService,
    private route: ActivatedRoute,
    private recordingsApi: AudioRecordingsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.models = retrieveResolvers(this.route.snapshot.data);

    const filters: Filters<AudioRecording> = {};
    if (this.site) {
      filters.filter = filterModel<Site, AudioRecording>("sites", this.site, filters.filter);
    } else if (this.region) {
      filters.filter = filterModel<Region, AudioRecording>("regions", this.region, filters.filter);
    } else if (this.project) {
      filters.filter = filterModel<Project, AudioRecording>("projects", this.project, filters.filter);
    }

    this.filters$.next(filters);

    this.filters$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (filters: Filters<AudioRecording>) =>
          (this.href = this.recordingsApi.batchDownloadUrl(filters))
      );
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  public get region(): Region {
    return this.models[regionKey] as Region;
  }

  public get site(): Site {
    return this.models[siteKey] as Site;
  }

  public get runScriptCommand(): string {
    return `./download_audio_files.ps1 -auth_token "${this.session.authToken}"`;
  }

  public get loginStrongRoute(): StrongRoute {
    return loginMenuItem.route;
  }

  public invalidForm(errors: any): boolean {
    return Object.entries(errors).some((value) => value[1]);
  }
}

function getPageInfo(
  subRoute: keyof typeof audioRecordingMenuItems.batch
): IPageInfo {
  return {
    category: audioRecordingsCategory,
    pageRoute: audioRecordingMenuItems.batch[subRoute],
    menus: {
      actionWidgets: List([
        new WidgetMenuItem(WebsiteStatusWarningComponent, () => true, {
          message: `
            Downloading audio is temporarily unavailable.
            Please try again later.
          `,
        }),
        licenseWidgetMenuItem,
      ]),
    },
    resolvers: {
      [projectKey]: projectResolvers.show,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

DownloadAudioRecordingsComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("site"));

export { DownloadAudioRecordingsComponent };
