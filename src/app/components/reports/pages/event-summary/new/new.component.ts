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
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
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
    this.model = new EventSummaryReportParameters();
  }

  public project: Project;
  public region?: Region;
  public site?: Site;
  public model = new EventSummaryReportParameters();

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


  protected get availableBucketSizes() {
    return Object.keys(BucketSize);
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    // each report is mounted/scoped from at least the project level
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
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
        propertyFilter<Region, "name">(
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
        propertyFilter<Site, "name">(
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
        propertyFilter<AudioEventProvenance, "name">(
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
        propertyFilter<Tag, "text">("text", text),
        excludePropertyValues<Tag>("text", activeTags)
      ),
    });

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

  // since this function is typically used in conjunction with the typeahead inputs, an object is returned
  protected getIdsFromAbstractModelArray(items: object[]): Id[] {
    // by default, typeahead inputs return an empty array if no items are selected
    // as we want to omit all conditions with no values in the qsp's, we should return null instead
    if (items.length === 0) {
      return null;
    }

    return items.map((item: AbstractModel): Id => item.id);
  }

  // because the DateTimeFilterModel is coming from a shared component, we need to serialize for use in the data model
  protected updateViewModelFromDateTimeModel(
    dateTimeModel: DateTimeFilterModel
  ): void {
    if (dateTimeModel.dateStartedAfter || dateTimeModel.dateFinishedBefore) {
      this.model.date = [
        dateTimeModel.dateStartedAfter ? DateTime.fromObject(dateTimeModel.dateStartedAfter) : null,
        dateTimeModel.dateFinishedBefore ? DateTime.fromObject(dateTimeModel.dateFinishedBefore) : null,
      ];
    }

    if (dateTimeModel.timeStartedAfter || dateTimeModel.timeFinishedBefore) {
      this.model.time = [
        dateTimeModel.timeStartedAfter,
        dateTimeModel.timeFinishedBefore,
      ];

      // because the daylight savings filter is a modifier on the time filter we do not need to update it unless the time filter has a value
      this.model.daylightSavings = !dateTimeModel.ignoreDaylightSavings;
    }
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