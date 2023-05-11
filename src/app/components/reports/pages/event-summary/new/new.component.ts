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
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Region } from "@models/Region";
import { Project } from "@models/Project";
import {
  reportMenuItems,
  reportCategories,
} from "@components/reports/reports.menu";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { StrongRoute } from "@interfaces/strongRoute";
import {
  notIn,
  filterAnd,
  filterModel,
  contains,
} from "@helpers/filters/filters";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { DateTime } from "luxon";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { StandardApi } from "@baw-api/api-common";
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
  protected availableBucketSizes = Object.keys(BucketSize);

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
    return `Project: ${this.project?.name}`;
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    // each report is mounted/scoped from at least the project level
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.sites = new Set<Id>([this.region.id]);
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.points = new Set<Id>([this.site.id]);
    }
  }

  public createSearchCallback<T extends AbstractModel>(
    api: StandardApi<T>,
    key: string = "name",
    includeDefaultFilters: boolean = true
  ): TypeaheadSearchCallback {
    return (text: string, activeItems: T[]): Observable<T[]> =>
      api.filter({
        filter: filterAnd(
          contains<T, keyof T>(
            key as keyof T,
            text as any,
            includeDefaultFilters && this.defaultFilter()
          ),
          notIn<T>(key as keyof AbstractModel, activeItems)
        ),
      });
  }

  // since the report is mounted at multiple points in the client (projects, regions, sites), we need to derive the lowest route to use
  public viewReportRoute(): StrongRoute {
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

    const idsArray: Id[] = items.map((item: AbstractModel): Id => item.id);
    return idsArray;
  }

  // because the DateTimeFilterModel is coming from a shared component, we need to serialize for use in the data model
  protected updateViewModelFromDateTimeModel(
    dateTimeModel: DateTimeFilterModel
  ): void {
    if (dateTimeModel.dateStartedAfter || dateTimeModel.dateFinishedBefore) {
      this.model.date = [
        dateTimeModel.dateStartedAfter
          ? DateTime.fromObject(dateTimeModel.dateStartedAfter)
          : null,
        dateTimeModel.dateFinishedBefore
          ? DateTime.fromObject(dateTimeModel.dateFinishedBefore)
          : null,
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
