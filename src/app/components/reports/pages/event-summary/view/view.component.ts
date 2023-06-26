import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
} from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  reportCategories,
  reportMenuItems,
} from "@components/reports/reports.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { User } from "@models/User";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { DateTime } from "luxon";
import embed, { VisualizationSpec } from "vega-embed";
import { BawSessionService } from "@baw-api/baw-session.service";
import { eventSummaryResolvers } from "@baw-api/reports/event-report/event-summary-report.service";
import { takeUntil } from "rxjs";
import { EventSummaryReportParameters } from "../EventSummaryReportParameters";
import speciesAccumulationCurveSchema from "./speciesAccumulationCurve.schema.json";
import speciesCompositionCurveSchema from "./speciesCompositionCurve.schema.json";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const parametersKey = "report";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
class ViewEventReportComponent
  extends PageComponent
  implements AfterViewInit, OnInit
{
  public constructor(
    private route: ActivatedRoute,
    private session: BawSessionService
  ) {
    super();
  }

  @ViewChild("accumulationCurve") public accumulationCurveElement: ElementRef;
  @ViewChild("compositionCurve") public compositionCurveElement: ElementRef;
  public queryStringParameters: EventSummaryReportParameters;
  public report: EventSummaryReport;
  public user: User;
  public project: Project;
  public region?: Region;
  public site?: Site;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (parameters: Params) =>
          (this.queryStringParameters = new EventSummaryReportParameters(
            parameters["sites"],
            parameters["points"],
            parameters["provenances"],
            parameters["events"],
            parameters["provenanceCutOff"],
            parameters["charts"],
            parameters["timeStartedAfter"],
            parameters["timeFinishedBefore"],
            parameters["dateStartedAfter"],
            parameters["dateFinishedBefore"],
            parameters["binSize"]
          ))
      );

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    // since route.snapshot.data is loosely typed as an object casing to a specific model type
    // adds additional type checking rather than losing type checking
    // however, if the models are in the wrong format here, TypeScript will not throw an error and result in a JS error during runtime
    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
    this.report = models[parametersKey] as EventSummaryReport;
  }

  public ngAfterViewInit(): void {
    const speciesAccumulationCurveData = speciesAccumulationCurveSchema;
    const speciesCompositionCurveData = speciesCompositionCurveSchema;
    speciesAccumulationCurveData.data.values =
      this.report.graphs?.accumulationData;
    speciesCompositionCurveData.data.values =
      this.report.graphs?.speciesCompositionData;

    embed(
      this.accumulationCurveElement.nativeElement,
      speciesAccumulationCurveData as VisualizationSpec
    );
    embed(
      this.compositionCurveElement.nativeElement,
      speciesCompositionCurveData as VisualizationSpec
    );
  }

  protected get eventDownloadUrl(): string {
    const base64Filters: string = this.queryStringParameters?.toFilterString();
    return (
      "https://api.staging.ecosounds.org/projects/1135/audio_events/download.csv/?filters=" +
      base64Filters
    );
  }

  protected get numberOfRecordingsAnalyzed(): string {
    return `${this.report.statistics?.countOfRecordingsAnalyzed} recordings`;
  }

  protected get numberOfBinsAnalyzed(): string {
    return `${this.report.statistics?.countOfRecordingsAnalyzed} ${this.binSize}'s`;
  }

  protected get totalSearchSpan(): string {
    return `${this.report.statistics?.totalSearchSpan} ${this.binSize}'s`;
  }

  protected get audioCoverageSpan(): string {
    return `${this.report.statistics?.audioCoverageOverSpan} ${this.binSize}'s`;
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
  // however, the API defaults to "Month" if no value is provided
  // therefore, we should reflect this client side
  protected get binSize(): string {
    if (this.queryStringParameters?.binSize) {
      return this.queryStringParameters.binSize;
    }

    return "month";
  }

  protected get confidenceCutOffPercentage(): string {
    // the queryStringParameters data model stores provenanceCutOff as a float between 0 and 1
    // because the view requires the value in a "percentage" (really score), we convert it in the view model
    if (this.queryStringParameters?.recogniserCutOff) {
      return this.queryStringParameters.recogniserCutOff * 100 + "%";
    }

    // the default cutoff is 0% as it allows all events through, regardless of confidence score
    return "0%";
  }

  protected get dateRange(): string {
    const endash = "&#8211;";
    const startDate: string =
      this.queryStringParameters?.dateStartedAfter ?? "";
    const endDate: string =
      this.queryStringParameters?.dateFinishedBefore ?? "";

    if (!startDate && !endDate) {
      return "(not specified)";
    }

    // we use an endash HTML character code to separate the start and end dates as they are a date range
    return `${startDate} ${endash} ${endDate}`;
  }

  protected get timeRange(): string {
    const endash = "&#8211;";
    const startTime: string =
      this.queryStringParameters?.timeStartedAfter ?? "";
    const endTime: string =
      this.queryStringParameters?.timeFinishedBefore ?? "";

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
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.view): IPageInfo {
  return {
    pageRoute: reportMenuItems.view[subRoute],
    category: reportCategories.view[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [parametersKey]: eventSummaryResolvers.filterShow,
    },
  };
}

ViewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewEventReportComponent };
