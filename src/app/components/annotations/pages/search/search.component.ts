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
import { CollectionIds, Id } from "@interfaces/apiInterfaces";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { Verification } from "@models/Verification";
import { Filters } from "@baw-api/baw-api.service";
import { first, takeUntil } from "rxjs";
import { BawSessionService } from "@baw-api/baw-session.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { VerificationService } from "@baw-api/verification/verification.service";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { projectAnnotationsModal } from "@components/projects/projects.modals";
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
    private session: BawSessionService,
  ) {
    super();
  }

  protected model: AnnotationSearchParameters;
  protected audioEvents: Verification[] = [];
  protected project: Project;
  protected region?: Region;
  protected site?: Site;

  public get dateFilters(): DateTimeFilterModel {
    return {};
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.model = this.model || new AnnotationSearchParameters({}, this.injector);
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.regions = new Set<Id>([this.region.id]);
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.sites = new Set<Id>([this.region.id]);
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
    const basePath = `https://api.staging.ecosounds.org/audio_recordings/${audioEvent.audioRecordingId}/original`;
    const urlParams =
      `?end_offset=${audioEvent.endTimeSeconds}&start_offset=${audioEvent.startTimeSeconds}` +
      `&user_token=${this.session.authToken}`;
    return basePath + urlParams;
  }

  protected updateModel(newModel: AnnotationSearchParameters): void {
    this.model = newModel;

    const filters = this.buildFilter(
      this.model.projects?.[0],
      this.model.regions,
      this.model.sites,
      this.model.tags,
      this.dateFilters
    );

    this.api
      .filter(filters)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((audioEvents) => {
        this.audioEvents = audioEvents;
      });
  }

  private buildFilter(
    _project: Project,
    _regions: CollectionIds,
    _sites: CollectionIds,
    tags: CollectionIds,
    _dateFilters: DateTimeFilterModel
  ): Filters<Verification> {
    return {
      filter: {
        isReference: {
          eq: true,
        },
        "tags.id": {
          in: tags ?? [],
        },
      },
    } as Filters<Verification>;

    // TODO: this is disabled because the API is not yet implemented
    // return {
    //   filter: {
    //     isReference: {
    //       eq: true,
    //     },
    //     "tags.id": {
    //       in: tags,
    //     },
    //     "projects.id": {
    //       eq: project.id,
    //     },
    //     "regions.id": {
    //       in: regions,
    //     },
    //     "sites.id": {
    //       in: sites,
    //     },
    //   },
    // } as Filters<Verification>;
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
