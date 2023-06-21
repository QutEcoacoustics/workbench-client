import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { eventSummaryResolvers } from "@baw-api/reports/event-summary/event-summary.service";
import { retrieveResolvers, hasResolvedSuccessfully } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  reportMenuItems,
  viewReportCategory,
} from "@components/reports/reports.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  AudioEventSummaryReport,
  IEventGroup,
} from "@models/AudioEventSummaryReport";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { DateTime } from "luxon";
import embed, { VisualizationSpec } from "vega-embed";
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
class ViewEventReportComponent extends PageComponent implements AfterViewInit, OnInit {
  public constructor(
    private route: ActivatedRoute
  ) {
    super();
  }

  @ViewChild("accumulationCurve") public accumulationCurveElement: ElementRef;
  @ViewChild("compositionCurve") public compositionCurveElement: ElementRef;
  public report: AudioEventSummaryReport;
  public project: Project;
  public region?: Region;
  public site?: Site;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    // console.log(models);

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
    this.report = models[parametersKey] as AudioEventSummaryReport;
  }

  public ngAfterViewInit(): void {
    const speciesAccumulationCurveData = speciesAccumulationCurveSchema;
    const speciesCompositionCurveData = speciesCompositionCurveSchema;
    speciesAccumulationCurveData.data.values =
      this.report.graphs.accumulationData;
    speciesCompositionCurveData.data.values =
      this.report.graphs.speciesCompositionData;

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

  public get eventGroups(): IEventGroup[] {
    return this.report.eventGroups;
  }

  public get reportGenerationDate(): string {
    return this.viewDateFromModelAttribute(this.report.generatedDate);
  }

  public get numberOfRecordingsAnalyzed(): string {
    return (
      this.report.statistics.countOfRecordingsAnalyzed.toString() +
      " recordings"
    );
  }

  public get numberOfBinsAnalyzed(): string {
    return (
      this.report.statistics.countOfRecordingsAnalyzed.toString() + " bins"
    );
  }

  public get totalSearchSpan(): string {
    return this.report.statistics.totalSearchSpan.toString() + " hours";
  }

  public get audioCoverageSpan(): string {
    return this.report.statistics.audioCoverageOverSpan.toString() + " hours";
  }

  public get audioStartDate(): string {
    return this.viewDateFromModelAttribute(
      this.report.statistics.coverageStartDay
    );
  }

  public get audioEndDate(): string {
    return this.viewDateFromModelAttribute(
      this.report.statistics.coverageEndDay
    );
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
    category: viewReportCategory,
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [parametersKey]: eventSummaryResolvers.show,
    },
  };
}

ViewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewEventReportComponent };
