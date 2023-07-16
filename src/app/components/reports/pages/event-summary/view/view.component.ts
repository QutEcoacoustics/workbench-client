import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  ShallowRegionsService,
  regionResolvers,
} from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
  ResolvedModelList,
} from "@baw-api/resolver-common";
import {
  ShallowSitesService,
  siteResolvers,
} from "@baw-api/site/sites.service";
import {
  reportCategories,
  reportMenuItems,
} from "@components/reports/reports.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { EventSummaryReport, IEventGroup } from "@models/EventSummaryReport";
import { User } from "@models/User";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { BawSessionService } from "@baw-api/baw-session.service";
import { eventSummaryResolvers } from "@baw-api/reports/event-report/event-summary-report.service";
import { Observable, first, forkJoin, of, take, takeUntil } from "rxjs";
import { API_ROOT } from "@services/config/config.tokens";
import { TagsService } from "@baw-api/tag/tags.service";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Duration } from "luxon";
import { Tag } from "@models/Tag";
import { Data } from "vega-lite/build/src/data";
import { EventSummaryReportParameters } from "../EventSummaryReportParameters";
import speciesAccumulationCurveSchema from "./speciesAccumulationCurve.schema.json";
import speciesCompositionCurveSchema from "./speciesCompositionCurve.schema.json";
import confidencePlotSchema from "./confidencePlot.schema.json";
import coveragePlotSchema from "./coveragePlot.schema.json";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const reportKey = "report";
const parameterDataModelKey = "parameterDataModel";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ViewEventReportComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private session: BawSessionService,
    private provenanceApi: AudioEventProvenanceService,
    private tagsApi: TagsService,
    private regionApi: ShallowRegionsService,
    private sitesApi: ShallowSitesService,
    @Inject(API_ROOT) private apiRoot: string
  ) {
    super();
  }

  public parameterDataModel: EventSummaryReportParameters;
  public report: EventSummaryReport;
  public user: User;
  public project: Project;
  public region?: Region;
  public site?: Site;

  protected regions: Observable<Region[]>;
  protected sites: Observable<Site[]>;
  protected tags: Observable<Tag[]>;

  protected speciesAccumulationCurveSchema = speciesAccumulationCurveSchema;
  protected speciesCompositionCurveSchema = speciesCompositionCurveSchema;
  protected confidencePlotSchema = confidencePlotSchema;
  protected coveragePlotSchema = coveragePlotSchema;

  public ngOnInit(): void {
    // we can use "as" here to provide stronger typing because the data property is a standard object type without any typing
    const models: ResolvedModelList = retrieveResolvers(
      this.route.snapshot.data as IPageInfo
    );

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((parameters: Params) => {
        this.parameterDataModel = new EventSummaryReportParameters(parameters);
      });

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    this.project = models[projectKey] as Project;

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
    }

    if (models[reportKey]) {
      this.report = models[reportKey] as EventSummaryReport;
    }

    this.regions = forkJoin(
      this.parameterDataModel.sites?.map((regionId: Id) =>
        this.regionApi.show(regionId).pipe(take(1), first())
      )
    );

    this.sites = forkJoin(
      this.parameterDataModel.points?.map((siteId: Id) =>
        this.sitesApi.show(siteId).pipe(take(1), first())
      )
    );

    this.tags = forkJoin(
      this.parameterDataModel.events?.map((tagId: Id) =>
        this.tagsApi.show(tagId).pipe(take(1), first())
      )
    );
  }

  protected printPage(): void {
    window.print();
  }

  protected get eventDownloadUrl(): string {
    return `${this.apiRoot}/projects/1135/audio_events/download.csv`;
  }

  protected get spectrogramUrls(): string[] {
    return [];
  }

  protected audioCoverageOverSpan(): Duration {
    return Duration.fromDurationLike(
      this.report.statistics?.audioCoverageOverSpan * 1000
    );
  }

  protected totalSearchSpan(): Duration {
    return Duration.fromDurationLike(
      this.report.statistics?.totalSearchSpan * 1000
    );
  }

  protected get currentUser(): User {
    if (this.session.isLoggedIn) {
      return this.session.loggedInUser;
    }

    return User.getUnknownUser(null);
  }

  protected bucketsWithRain(eventGroup: IEventGroup): number {
    return eventGroup.bucketsWithInterference.length;
  }

  // this text is used whenever a filter parameter has not been explicitly defined. e.g. neither a start or end date/time range is specified
  protected static defaultFilterText(): string {
    return "(not specified)";
  }

  protected getProvenance(provenanceId: Id): Observable<AudioEventProvenance> {
    return this.provenanceApi.show(provenanceId).pipe(
      first()
    );
  }

  protected getTag(tagId: Id): Observable<Tag> {
    return this.tagsApi.show(tagId).pipe(
      first()
    );
  }

  protected selectedSites(): Observable<Site[]> {
    if (!this.sites) {
      if (this.site) {
        return of([this.site]);
      } else if (this.region) {
        return of(this.region.sites);
      } else if (this.project) {
        return of(this.project.sites);
      }
    } else {
      return this.sites;
    }
  }

  protected coverageData(): Data {
    // recordingCoverage: report.graphs.coverageData.recordingCoverage,
    // analysisCoverage: report.graphs.coverageData.analysisCoverage
    const recordingCoverage = this.report.graphs.coverageData.recordingCoverage.map((dateRange) =>
      Object({
        recordingStartDate: dateRange.startDate,
        recordingEndDate: dateRange.endDate,
      })
    );

    const analysisCoverage = this.report.graphs.coverageData.analysisCoverage.map((dateRange) =>
      Object({
        analysisStartDate: dateRange.startDate,
        analysisEndDate: dateRange.endDate
      })
    );

    return [
      ...recordingCoverage,
      ...analysisCoverage
    ];
  }
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.view): IPageInfo {
  return {
    pageRoute: reportMenuItems.view[subRoute],
    category: reportCategories.view[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [reportKey]: eventSummaryResolvers.filterShow,
    },
  };
}

ViewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewEventReportComponent };
