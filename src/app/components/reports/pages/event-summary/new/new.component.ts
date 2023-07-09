import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ActivatedRoute } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { Observable } from "rxjs";
import { InnerFilter } from "@baw-api/baw-api.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  ShallowSitesService,
  siteResolvers,
} from "@baw-api/site/sites.service";
import {
  regionResolvers,
  ShallowRegionsService,
} from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
} from "@baw-api/resolver-common";
import { Region } from "@models/Region";
import { Project } from "@models/Project";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import {
  reportMenuItems,
  reportCategories,
} from "@components/reports/reports.menu";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  excludePropertyValues,
  filterAnd,
  filterModel,
  propertyFilter,
} from "@helpers/filters/filters";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { DateTime } from "luxon";
import {
  BucketSize,
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-new-summary-report",
  templateUrl: "./new.component.html",
})
class NewEventReportComponent extends PageComponent implements OnInit {
  public constructor(
    protected sitesApi: ShallowSitesService,
    protected regionsApi: ShallowRegionsService,
    protected provenanceApi: AudioEventProvenanceService,
    protected tagsApi: TagsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public project: Project;
  public region?: Region;
  public site?: Site;
  public model = new EventSummaryReportParameters();

  // TODO: remove before review
  public bucketSizes = BucketSize;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    this.model = new EventSummaryReportParameters();

    if (models[projectKey]) {
      this.project = models[projectKey] as Project;
    }

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.sites = [this.region.id];
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.points = [this.site.id];
    }
  }

  public regionsSearchCallback = (
    regionName: string,
    activeRegions: Region[]
  ): Observable<Region[]> =>
    this.regionsApi.filter({
      filter: filterAnd(
        propertyFilter<Region>(
          "name",
          regionName,
          this.defaultFilter() as InnerFilter<Region>
        ),
        excludePropertyValues<Region>("name", activeRegions)
      ),
    });

  public siteSearchCallback = (
    siteName: string,
    activeSites: Site[]
  ): Observable<Site[]> =>
    this.sitesApi.filter({
      filter: filterAnd(
        propertyFilter<Site>(
          "name",
          siteName,
          this.defaultFilter() as InnerFilter<Site>
        ),
        excludePropertyValues<Site>("name", activeSites)
      ),
    });

  public provenanceSearchCallback = (
    provenanceName: string,
    activeProvenances: AudioEventProvenance[]
  ): Observable<AudioEventProvenance[]> =>
    this.provenanceApi.filter({
      filter: filterAnd(
        propertyFilter<AudioEventProvenance>(
          "name",
          provenanceName,
          this.defaultFilter() as InnerFilter<AudioEventProvenance>
        ),
        excludePropertyValues<AudioEventProvenance>("name", activeProvenances)
      ),
    });

  public eventsOfInterestSearchCallback = (
    text: string,
    activeTags: Tag[]
  ): Observable<Tag[]> =>
    this.tagsApi.filter({
      filter: filterAnd(
        propertyFilter<Tag>("text", text),
        excludePropertyValues<Tag>("text", activeTags)
      ),
    });

  protected get componentTitle(): string {
    if (this.site) {
      return this.site.isPoint
        ? `Point: ${this.site.name}`
        : `Site: ${this.site.name}`;
    } else if (this.region) {
      return `Site: ${this.region.name}`;
    }

    // it can be assumed that all reports will be generated from at least at the project level
    // therefore, if no sites or regions are specified, we can assume that the report is being generated at the project level
    return `Project: ${this.project.name}`;
  }

  // since the report is mounted at multiple points in the client (projects, regions, sites), we need to derive the lowest route to use
  protected viewReportRoute(): StrongRoute {
    if (this.site) {
      return this.site.isPoint
        ? reportMenuItems.view.siteAndRegion.route
        : reportMenuItems.view.site.route;
    } else if (this.region) {
      return reportMenuItems.view.region.route;
    }

    return reportMenuItems.view.project.route;
  }

  protected isInvalidProvenanceCutOff(value: any): boolean {
    // if the user inputs a string (and not a number) into the input, the value will be null
    if (value === null) {
      return true;
    }

    return value < 0 || value > 1;
  }

  protected getIdsFromAbstractModelArray(item: any[]): number[] {
    return item.map((am) => am.id);
  }

  protected updateViewModelFromDateTimeModel(
    dateTimeModel: DateTimeFilterModel
  ): void {
    this.model.daylightSavings = !dateTimeModel.ignoreDaylightSavings;
    this.model.date = [
      DateTime.fromObject(dateTimeModel.dateStartedAfter),
      DateTime.fromObject(dateTimeModel.dateFinishedBefore),
    ];
    this.model.time = [
      dateTimeModel.timeStartedAfter,
      dateTimeModel.timeFinishedBefore,
    ];
  }

  // we need a default filter to scope to projects, regions, sites
  private defaultFilter(): InnerFilter<Region | Site> {
    // we don't need to filter for every route, we only need to filter for the lowest level
    // this is because all sites have a region, all regions have a project, etc..
    // so it can be logically inferred
    if (this.site) {
      return filterModel("sites", this.site);
    } else if (this.region) {
      return filterModel("regions", this.region);
    } else {
      return filterModel("projects", this.project);
    }
  }
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.new): IPageInfo {
  return {
    pageRoute: reportMenuItems.new[subRoute],
    category: reportCategories.new[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

NewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { NewEventReportComponent };
