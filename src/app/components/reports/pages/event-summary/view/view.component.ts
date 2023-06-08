import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  reportMenuItems,
  viewReportCategory,
} from "@components/reports/reports.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AudioEventSummaryReport, IEventGroup } from "@models/AudioEventSummaryReport";
import { generateAudioEventSummaryReport } from "@test/fakes/AudioEventSummaryReport";
import { DateTime } from "luxon";
import embed, { VisualizationSpec } from "vega-embed";
import speciesAccumulationCurveSchema from "./speciesAccumulationCurve.schema.json"
import speciesCompositionCurveSchema from "./speciesCompositionCurve.schema.json";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
class ViewEventReportComponent extends PageComponent implements AfterViewInit {
  public constructor(public router: Router) {
    super();
  }

  @ViewChild("accumulationCurve") public accumulationCurveElement: ElementRef;
  @ViewChild("compositionCurve") public compositionCurveElement: ElementRef;
  public report: AudioEventSummaryReport = new AudioEventSummaryReport(generateAudioEventSummaryReport());
  public reportFilters: Filters = {};
  public speciesAccumulationCurveData = speciesAccumulationCurveSchema;
  public speciesCompositionCurveData = speciesCompositionCurveSchema;

  public ngAfterViewInit(): void {
    this.speciesAccumulationCurveData.data.values = this.report.graphs.accumulationData;
    this.speciesCompositionCurveData.data.values = this.report.graphs.speciesCompositionData;

    embed(
      this.accumulationCurveElement.nativeElement,
      this.speciesAccumulationCurveData as VisualizationSpec
    );
    embed(
      this.compositionCurveElement.nativeElement,
      this.compositionCurveData as VisualizationSpec
    );
  }

  public printPage(): void {
    window.print();
  }

  private viewDateFromModelAttribute(date: DateTime | string): string {
    const reportDateTimeObject: DateTime = date instanceof DateTime ? date : DateTime.fromISO(date);
    return reportDateTimeObject.toFormat("yyyy-MM-dd HH:MM");
  }

  public get eventGroups(): IEventGroup[] {
    return this.report.eventGroups;
  }

  public get reportGenerationDate(): string {
    return this.viewDateFromModelAttribute(this.report.generatedDate);
  }

  public get numberOfRecordingsAnalyzed(): string {
    return this.report.statistics.countOfRecordingsAnalyzed.toString() + " recordings";
  }

  public get numberOfBinsAnalyzed(): string {
    return this.report.statistics.countOfRecordingsAnalyzed.toString() + " bins";
  }

  public get totalSearchSpan(): string {
    return this.report.statistics.totalSearchSpan.toString() + " hours";
  }

  public get audioCoverageSpan(): string {
    return this.report.statistics.audioCoverageOverSpan.toString() + " hours";
  }

  public get audioStartDate(): string {
    return this.viewDateFromModelAttribute(this.report.statistics.coverageStartDay);
  }

  public get audioEndDate(): string {
    return this.viewDateFromModelAttribute(this.report.statistics.coverageEndDay);
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
    },
  };
}

ViewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewEventReportComponent };
