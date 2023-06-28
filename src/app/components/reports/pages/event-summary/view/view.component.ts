import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
  ResolvedModelList,
} from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
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
import { DateTime } from "luxon";
import embed, { VisualizationSpec } from "vega-embed";
import { BawSessionService } from "@baw-api/baw-session.service";
import { eventSummaryResolvers } from "@baw-api/reports/event-report/event-summary-report.service";
import { takeUntil } from "rxjs";
import { API_ROOT } from "@services/config/config.tokens";
import { EventSummaryReportParameters } from "../EventSummaryReportParameters";
import speciesAccumulationCurveSchema from "./speciesAccumulationCurve.schema.json";
import speciesCompositionCurveSchema from "./speciesCompositionCurve.schema.json";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const reportKey = "report";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
class ViewEventReportComponent
  extends PageComponent
  implements AfterViewInit, OnInit {
  public constructor(
    private route: ActivatedRoute,
    private session: BawSessionService,
    @Inject(API_ROOT) private apiRoot: string
  ) {
    super();
  }

  @ViewChild("accumulationCurve") public accumulationCurveElement: ElementRef;
  @ViewChild("compositionCurve") public compositionCurveElement: ElementRef;
  public parameterDataModel: EventSummaryReportParameters;
  public report: EventSummaryReport;
  public user: User;
  public project: Project;
  public region?: Region;
  public site?: Site;

  public ngOnInit(): void {
    // we can use "as" here to provide stronger typing because the data property is a standard object type without any typing
    const models: ResolvedModelList = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((parameters: Params) => {
        this.parameterDataModel = new EventSummaryReportParameters(parameters);
      });

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

    if (models[reportKey]) {
      this.report = models[reportKey] as EventSummaryReport;
    }
  }

  public ngAfterViewInit(): void {
    speciesAccumulationCurveSchema.data.values = this.report.graphs?.accumulationData;
    speciesCompositionCurveSchema.data.values = this.report.graphs?.speciesCompositionData;

    embed(
      this.accumulationCurveElement.nativeElement,
      speciesAccumulationCurveSchema as VisualizationSpec
    );
    embed(
      this.compositionCurveElement.nativeElement,
      speciesCompositionCurveSchema as VisualizationSpec
    );
  }

  protected printPage(): void {
    window.print();
  }

  protected get eventDownloadUrl(): string {
    const base64Filters: string = this.parameterDataModel?.toFilterString();
    return `${this.apiRoot}/projects/1135/audio_events/download.csv/?filters=${base64Filters}`;
  }

  protected get numberOfRecordingsAnalyzed(): string {
    return `${this.report.statistics?.countOfRecordingsAnalyzed} recordings`;
  }

  protected get numberOfBinsAnalyzed(): string {
    return `${this.report.statistics?.countOfRecordingsAnalyzed} ${this.binSize}s`;
  }

  protected get totalSearchSpan(): string {
    return `${this.report.statistics?.totalSearchSpan} ${this.binSize}s`;
  }

  protected get audioCoverageSpan(): string {
    return `${this.report.statistics?.audioCoverageOverSpan} ${this.binSize}s`;
  }

  protected get currentUser(): string {
    if (this.session.isLoggedIn) {
      return this.session.loggedInUser.userName;
    }

    // Using "Unknown User" is consistent with other locations in the client when the user is not logged in
    // e.g. The audio recordings list page
    return "Unknown User";
  }

  // bin size is a mandatory field on the report creation page
  // however, the API defaults to "month" if no value is provided
  // therefore, we should reflect this client side
  protected get binSize(): string {
    if (this.parameterDataModel?.binSize) {
      return this.parameterDataModel.binSize;
    }

    return "month";
  }

  protected get confidenceCutOffPercentage(): string {
    // the queryStringParameters data model stores provenanceCutOff as a float between 0 and 1
    // because the view requires the value in a "percentage" (really score), we convert it in the view model
    if (this.parameterDataModel?.recogniserCutOff) {
      return `${this.parameterDataModel.recogniserCutOff * 100}%`;
    }

    // the default cutoff is 0% as it allows all events through, regardless of confidence score
    return "0%";
  }

  protected get dateRange(): string {
    const endash = "&#8211;";
    const startDate: string =
      this.parameterDataModel?.dateStartedAfter?.toFormat("yyyy-MM-dd") ?? "";
    const endDate: string =
      this.parameterDataModel?.dateFinishedBefore?.toFormat("yyyy-MM-dd") ?? "";

    if (!startDate && !endDate) {
      return "(not specified)";
    }

    // we use an endash HTML character code to separate the start and end dates as they are a date range
    return `${startDate} ${endash} ${endDate}`;
  }

  protected get timeRange(): string {
    const endash = "&#8211;";
    const startTime: string =
      this.parameterDataModel?.timeStartedAfter?.toFormat("hh:mm") ?? "";
    const endTime: string =
      this.parameterDataModel?.timeFinishedBefore?.toFormat("hh:mm") ?? "";

    if (!startTime && !endTime) {
      return "(not specified)";
    }

    return `${startTime} ${endash} ${endTime}`;
  }

  protected get reportGenerationDate(): string {
    const date: DateTime | string = this.report.generatedDate ?? DateTime.now();

    const reportDateTimeObject: DateTime =
      date instanceof DateTime ? date : DateTime.fromISO(date);
    return reportDateTimeObject.toFormat("yyyy-MM-dd HH:MM");
  }

  protected binsWithRain(eventGroup: IEventGroup): number {
    return eventGroup.binsWithInterference.length;
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
