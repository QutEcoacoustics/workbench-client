import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { Id } from "@interfaces/apiInterfaces";
import { Verification } from "@models/Verification";
import { Filters, Paging } from "@baw-api/baw-api.service";
import { first, takeUntil } from "rxjs";
import { BawSessionService } from "@baw-api/baw-session.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { VerificationService } from "@baw-api/verification/verification.service";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { projectAnnotationsModal } from "@components/projects/projects.modals";
import { AudioEvent } from "@models/AudioEvent";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-annotation-search",
  templateUrl: "search.component.html",
  styleUrl: "search.component.scss",
})
class AnnotationSearchComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private api: VerificationService,
    private session: BawSessionService
  ) {
    super();
  }

  public model: AnnotationSearchParameters;
  public audioEvents: Verification[] = [];
  public project: Project;
  public region?: Region;
  public site?: Site;
  public previewPage = 1;
  private previewSize = 3;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.model =
      this.model || new AnnotationSearchParameters({}, this.injector);
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.regions = new Set<Id>([this.region.id]);
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.sites = new Set<Id>([this.site.id]);
    }
  }

  protected verifyAnnotationsRoute(): StrongRoute {
    if (this.site) {
      return this.site.isPoint
        ? annotationMenuItems.verify.siteAndRegion.route
        : annotationMenuItems.verify.site.route;
    } else if (this.region) {
      return annotationMenuItems.verify.region.route;
    }

    return annotationMenuItems.verify.project.route;
  }

  protected buildAudioUrl(audioEvent: Verification): string {
    const basePath = `https://api.staging.ecosounds.org/audio_recordings/${audioEvent.audioRecordingId}/media.flac`;
    const urlParams =
      `?audio_event_id=${audioEvent.id}` +
      `&end_offset=${audioEvent.endTimeSeconds}&start_offset=${audioEvent.startTimeSeconds}` +
      `&user_token=${this.session.authToken}`;
    return basePath + urlParams;
  }

  protected updateModel(newModel: AnnotationSearchParameters): void {
    this.model = newModel;

    const filters = this.buildFilter();
    const tagsArray = Array.from(this.model.tags);

    if (tagsArray.length > 0) {
      this.api
        .filter(filters)
        .pipe(first(), takeUntil(this.unsubscribe))
        .subscribe((audioEvents) => {
          this.audioEvents = audioEvents;
        });
    } else {
      this.audioEvents = [];
    }
  }

  protected pagePreviewNext(): void {
    this.previewPage++;
  }

  protected pagePreviewPrevious(): void {
    if (this.pagedItems <= 0) {
      this.pagedItems = 0;
      return;
    }

    this.previewPage--;
  }

  private buildFilter(): Filters<AudioEvent> {
    const filter: Filters<AudioEvent> = this.model.toFilter();
    const paging: Paging = {
      page: this.previewPage,
      items: this.previewSize,
    };

    filter.paging = paging;
    return filter;
  }
}

function getPageInfo(
  subRoute: keyof typeof annotationMenuItems.search
): IPageInfo {
  return {
    pageRoute: annotationMenuItems.search[subRoute],
    category: annotationMenuItems.search[subRoute],
    menus: {
      actions: List([
        annotationMenuItems.verify[subRoute],
        projectAnnotationsModal,
      ]),
    },
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

AnnotationSearchComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { AnnotationSearchComponent };
