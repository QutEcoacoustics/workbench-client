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

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
    this.report = models[parametersKey] as EventSummaryReport;
  }

  public ngAfterViewInit(): void {
    const speciesAccumulationCurveData = speciesAccumulationCurveSchema;
    const speciesCompositionCurveData = speciesCompositionCurveSchema;
    speciesAccumulationCurveData.data.values =
      this.report?.graphs?.accumulationData;
    speciesCompositionCurveData.data.values =
      this.report?.graphs?.speciesCompositionData;

    embed(
      this.accumulationCurveElement.nativeElement,
      speciesAccumulationCurveData as VisualizationSpec
    );
    embed(
      this.compositionCurveElement.nativeElement,
      speciesCompositionCurveData as VisualizationSpec
    );
  }

  public printPage(): void {
    window.print();
  }

  protected get eventGroups(): IEventGroup[] {
    return this.report?.eventGroups;
  }

  protected get reportGenerationDate(): string {
    return this.viewDateFromModelAttribute(
      this.report?.generatedDate ?? DateTime.now()
    );
  }

  protected get numberOfRecordingsAnalyzed(): string {
    return (
      this.report?.statistics?.countOfRecordingsAnalyzed?.toString() +
      " recordings"
    );
  }

  protected get numberOfBinsAnalyzed(): string {
    return (
      this.report?.statistics?.countOfRecordingsAnalyzed?.toString() + " bins"
    );
  }

  protected get totalSearchSpan(): string {
    return this.report?.statistics?.totalSearchSpan?.toString() + " hours";
  }

  protected get audioCoverageSpan(): string {
    return this.report?.statistics?.audioCoverageOverSpan?.toString() + " hours";
  }

  protected get currentUser(): string {
    if (this.session.isLoggedIn) {
      return this.session.loggedInUser.userName;
    }

    return "Unknown User";
  }

  protected get timeRange(): string {
    return `${this.startTime} - ${this.endTime}`;
  }

  protected get dateRange(): string {
    return `${this.startDate} - ${this.endDate}`;
  }

  protected get binSize(): string {
    return this.queryStringParameters.binSize ?? "Month";
  }

  private get startDate(): string {
    return this.queryStringParameters.dateFinishedBefore ?? "0000-00-00";
  }

  private get endDate(): string {
    return this.queryStringParameters.dateStartedAfter ?? "9999-00-00";
  }

  private get startTime(): string {
    return this.queryStringParameters.timeFinishedBefore ?? "00:00";
  }

  private get endTime(): string {
    return this.queryStringParameters.timeStartedAfter ?? "24:00";
  }

  private viewDateFromModelAttribute(date: DateTime | string): string {
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
