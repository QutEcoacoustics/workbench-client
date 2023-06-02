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

  public ngAfterViewInit(): void {
    embed(
      this.accumulationCurveElement.nativeElement,
      this.speciesAccumulationCurveData
    );
    embed(
      this.compositionCurveElement.nativeElement,
      this.compositionCurveData
    );

    console.log(this.report);
  }

  public speciesAccumulationCurveData: VisualizationSpec = {
    width: "container",
    height: "container",
    data: {
      values: this.report.graphs.accumulationData
    },
    layer: [
      {
        mark: {
          type: "point",
          filled: true,
          color: "black",
        },
        encoding: {
          x: { field: "date", type: "nominal", axis: { labelAngle: 0 } },
          y: { field: "species", type: "quantitative", axis: { labelAngle: 0 } },
        },
      },
      {
        mark: "errorbar",
        encoding: {
          x: {
            field: "date",
            type: "nominal",
          },
          y: { field: "error", type: "quantitative" },
          y2: { field: "error2", type: "quantitative" }
        },
      },
      {
        mark: "line",
        encoding: {
          x: { field: "date", type: "nominal", axis: { labelAngle: 0 } },
          y: { field: "species", type: "quantitative", axis: { labelAngle: 0 } },
        },
      },
    ],
  };

  public printPage(): void {
    window.print();
  }

  public compositionCurveData: VisualizationSpec = {
    width: "container",
    height: "container",
    data: {
      values: this.report.graphs.speciesCompositionData
    },
    mark: "area",
    encoding: {
      x: {
        field: "date",
        type: "nominal"
      },
      y: {
        aggregate: "sum",
        field: "count",
      },
      color: {
        field: "series",
        scale: { scheme: "category20b" },
      },
    },
  };

  private viewDateFromModelAttribute(date: DateTime | string): string {
    const reportDateTimeObject: DateTime = date instanceof DateTime ? date : DateTime.fromISO(date);
    return reportDateTimeObject.toFormat("yyyy.MM.dd");
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
