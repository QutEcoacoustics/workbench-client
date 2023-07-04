import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ActivatedRoute } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { Observable } from "rxjs";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
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
import { filterAnd, filterModel, propertyFilter } from "@helpers/filters/filters";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
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

  public dateTimeModel: DateTimeFilterModel;

  // TODO: remove before review
  public bucketSizes = BucketSize;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    if (models[projectKey]) {
      this.project = models[projectKey] as Project;
    }

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
    }

    // if there is a region or site, we should immutable scope the report to this location
    this.model = new EventSummaryReportParameters({
      sites: [this.region],
      points: [this.site],
    });
  }

  // while this could be generalised, I have chosen not to as it'd lose a lot of strong type safety without the use of generics
  // as we are using these formatters in ng html templates, it is not possible to use TypeScript generics to enfore type safety
  // on a generalised function
  public regionFormatter = (region: Region) => region.name;
  public siteFormatter = (site: Site) => site.name;
  public provenanceFormatter = (provenance: AudioEventProvenance) =>
    provenance.name;
  public eventsOfInterestFormatter = (tag: Tag): string => tag.text;

  // TODO: this currently does not scope to projects, regions, sites correctly
  public regionsSearchCallback = (regionName: string): Observable<Region[]> =>
    this.regionsApi.filter({
      filter: filterAnd(
        this.defaultFilter(),
        propertyFilter<Region>("name", regionName)
      ),
    } as Filters<Region>);

  public siteSearchCallback = (siteName: string): Observable<Site[]> =>
    this.sitesApi.filter({
      filter: filterAnd(
        this.defaultFilter(),
        propertyFilter<Site>("name", siteName)
      ),
    } as Filters<Site>);

  public provenanceSearchCallback = (
    provenanceName: string
  ): Observable<AudioEventProvenance[]> =>
    this.provenanceApi.filter({
      filter: filterAnd(
        this.defaultFilter,
        propertyFilter<AudioEventProvenance>("name", provenanceName)
      ),
    } as Filters<AudioEventProvenance>);

  public eventsOfInterestSearchCallback = (text: string): Observable<Tag[]> =>
    this.tagsApi.filter({
      filter: propertyFilter<Tag>("text", text)
    } as Filters<Tag>);

  protected isValidProvenanceCutOff(): boolean {
    return (
      this.model.score >= 0 &&
      this.model.score <= 1
    );
  }

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

  protected getIdsFromAbstractModelArray(item: any[]): number[] {
    return item.map((am) => am.id);
  }

  // we need a default filter to scope to projects, regions, sites
  private defaultFilter(): InnerFilter {
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
