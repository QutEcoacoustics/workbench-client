import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
} from "@baw-api/resolver-common";
import { IRegion, Region } from "@models/Region";
import { Project } from "@models/Project";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import {
  reportMenuItems,
  reportCategories,
} from "@components/reports/reports.menu";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { Id } from "@interfaces/apiInterfaces";
import { id } from "@baw-api/api-common";
import { RouteParams } from "@interfaces/strongRoute";
import { AudioRecordingFilterModel } from "@shared/audio-recordings-filter/audio-recordings-filter.component";
import { DateTime } from "luxon";
import {
  BinSize,
  EventSummaryReportParameters,
  GraphType,
} from "../EventSummaryReportParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface IEventReportConditions {
  dateTime: BehaviorSubject<AudioRecordingFilterModel>;
  regions: BehaviorSubject<Region[]>;
  sites: BehaviorSubject<Site[]>;
  provenances: BehaviorSubject<AudioEventProvenance[]>;
  provenanceScoreCutOff: number;
  charts: BehaviorSubject<string[]>;
  eventsOfInterest: BehaviorSubject<Tag[]>;
  binSize: BinSize;
}

@Component({
  selector: "baw-new-summary-report",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
class NewEventReportComponent extends PageComponent implements OnInit {
  public constructor(
    protected sitesApi: SitesService,
    protected regionsApi: RegionsService,
    protected provenanceApi: AudioEventProvenanceService,
    protected tagsApi: TagsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public project: Project;
  public region?: Region;
  public site?: Site;

  public model: IEventReportConditions = {
    dateTime: new BehaviorSubject<AudioRecordingFilterModel>({}),
    regions: new BehaviorSubject<Region[]>([]),
    sites: new BehaviorSubject<Site[]>([]),
    provenances: new BehaviorSubject<AudioEventProvenance[]>([]),
    provenanceScoreCutOff: 0.8,
    charts: new BehaviorSubject<string[]>([]),
    eventsOfInterest: new BehaviorSubject<Tag[]>([]),
    binSize: "month",
  };

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
  }

  public generateReport(): void {
    if (!this.isValidProvenanceCutOff()) {
      return;
    }

    const parameterModel = this.createSearchParametersDataModel();
    const queryStringParameters = parameterModel.toQueryString();

    this.router.navigateByUrl(
      this.viewReportUrl() + `?${queryStringParameters}`
    );
  }

  // while this could be generalised, I have chosen not to as it'd lose a lot of strong type safety without the use of generics
  // as we are using these formatters in ng html templates, it is not possible to use TypeScript generics to enfore type safety
  // on a generalised function
  public regionFormatter = (region: Region) => region.name;
  public siteFormatter = (site: Site) => site.name;
  public provenanceFormatter = (provenance: AudioEventProvenance) => provenance.name;
  public chartsFormatter = (chart: string) => chart;
  public eventsOfInterestFormatter = (tag: Tag): string => tag.text;

  public regionsOptions = (
    regionName: string
  ): Observable<Region[]> => {
    const filter: Filters<IRegion> = {
      filter: {
        name: {
          contains: regionName,
        },
      },
    };

    return this.regionsApi.filter(filter, this.project);
  };

  public siteOptions = (siteName: string): Observable<Site[]> => {
    const filter: Filters<Site> = {
      filter: {
        name: {
          contains: siteName,
        },
      },
    };

    return this.sitesApi.filter(filter, this.project);
  };

  public provenanceOptions = (
    provenanceName: string
  ): Observable<AudioEventProvenance[]> => {
    const filter: Filters<AudioEventProvenance> = {
      filter: {
        name: {
          contains: provenanceName,
        },
      },
    };

    return this.provenanceApi.filter(filter);
  };

  public eventsOfInterestOptions = (text: string): Observable<Tag[]> => {
    const filter: Filters<Tag> = {
      filter: {
        text: {
          contains: text,
        },
      },
    };

    return this.tagsApi.filter(filter);
  };

  public chartsFilter = (text: string): Observable<string[]> =>
    of(NewEventReportComponent.availableCharts.filter((chart) => chart.includes(text)));

  protected isValidProvenanceCutOff(): boolean {
    return this.model.provenanceScoreCutOff >= 0 && this.model.provenanceScoreCutOff <= 1;
  }

  protected get componentTitle(): string {
    if (this.site) {
      return this.site.isPoint ?
        `Point: ${this.site.name}` :
        `Site: ${this.site.name}`;
    } else if (this.region) {
      return `Site: ${this.region.name}`;
    }

    // it can be assumed that all reports will be generated from at least at the project level
    // therefore, if no sites or regions are specified, we can assume that the report is being generated at the project level
    return `Project: ${this.project.name}`;
  }

  // since the report is mounted at multiple points in the client (projects, regions, sites), we need to derive the lowest route to use
  private viewReportUrl(): string {
    const routeParameters: RouteParams = {
      projectId: id(this.project),
      regionId: id(this.region),
      siteId: id(this.site),
    };

    if (this.site) {
      return this.site.isPoint
        ? reportMenuItems.view.siteAndRegion.route.format(routeParameters)
        : reportMenuItems.view.site.route.format(routeParameters);
    } else if (this.region) {
      return reportMenuItems.view.region.route.format(routeParameters);
    }

    return reportMenuItems.view.project.route.format(routeParameters);
  }

  private createSearchParametersDataModel(): EventSummaryReportParameters {
    const regionIds: Id[] = this.model.regions.value.map((region) => region.id);
    const siteIds: Id[] = this.model.sites.value.map((site) => site.id);
    const provenanceIds: Id[] = this.model.provenances.value.map(
      (provenance) => provenance.id
    );
    const eventIds: Id[] = this.model.eventsOfInterest.value.map(
      (event) => event.id
    );

    // since audio recording filters are a behavior subject, it is possible to get the last emitted value
    // without race conditions, subscriptions, or succumbing or poor coding practices
    const dateTimeFilters: AudioRecordingFilterModel =
      this.model.dateTime.getValue();

    const dataModel = new EventSummaryReportParameters();

    const startDate: DateTime = dateTimeFilters.dateStartedAfter
      ? DateTime.fromObject(dateTimeFilters.dateStartedAfter) : null;
    const endDate: DateTime = dateTimeFilters.dateFinishedBefore
      ? DateTime.fromObject(dateTimeFilters.dateFinishedBefore) : null;

    dataModel.sites = regionIds;
    dataModel.points = siteIds;
    dataModel.provenances = provenanceIds;
    dataModel.events = eventIds;
    dataModel.recogniserCutOff = this.model.provenanceScoreCutOff;
    dataModel.charts = this.model.charts.value;
    dataModel.timeStartedAfter = dateTimeFilters.timeStartedAfter;
    dataModel.timeFinishedBefore = dateTimeFilters.timeFinishedBefore;
    dataModel.dateStartedAfter = startDate;
    dataModel.dateFinishedBefore = endDate;
    dataModel.binSize = this.model.binSize;
    dataModel.ignoreDaylightSavings = dateTimeFilters.ignoreDaylightSavings;

    return dataModel;
  }

  // we use a static array here as the list of possible charts the report can generate is directly linked to the template
  private static availableCharts: GraphType[] = [
    "Sensor Point Map",
    "Species Accumulation Curve",
    "Species Composition Curve",
    "False Colour Spectrograms",
  ];
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
