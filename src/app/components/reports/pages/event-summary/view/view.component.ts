import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  reportMenuItems,
  viewReportCategory,
} from "@components/reports/reports.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Id } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTime, Duration } from "luxon";
import embed, { VisualizationSpec } from "vega-embed";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

type GraphUrl = string;

type AccumulationDataGraph = AccumulationDataPoint[];
type SpeciesCompositionDataGraph = SpeciesCompositionDataPoint[];
type AnalysisCoverageDataGraph = AnalysisCoverageDataPoint[];

interface AccumulationDataPoint {
  date: DateTime;
  countOfSpecies: number;
  error: number;
}

interface SpeciesCompositionDataPoint {
  date: DateTime;
  values: {
    tagId: Id;
    ratio: number;
  }[];
}

interface AnalysisCoverageDataPoint {
  date: DateTime;
  audioCoverage: number;
  analysisCoverage: number;
}

type Graph =
  | AccumulationDataGraph
  | SpeciesCompositionDataGraph
  | AnalysisCoverageDataGraph
  | GraphUrl;

interface Report {
  project?: Project;
  region?: Region[];
  sites?: Site[];
  startDate?: DateTime;
  endDate?: DateTime;
  startTime?: Duration;
  endTime?: Duration;
  provenances?: Id[];
  minimumScore?: number;
  tags?: Tag[];
  analysisJob?: AnalysisJob;
  graphs?: Graph[];
}

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
  public report: Report = {};

  public ngAfterViewInit(): void {
    embed(
      this.accumulationCurveElement.nativeElement,
      this.speciesAccumulationCurveData
    );
    embed(
      this.compositionCurveElement.nativeElement,
      this.compositionCurveData
    );
  }

  public speciesAccumulationCurveData: VisualizationSpec = {
    width: "container",
    height: "container",
    data: {
      values: [
        { date: "22-05-2023", species: 5, error: 5 - 0.5, error2: 5 + 0.5 },
        { date: "23-05-2023", species: 3, error: 3 - 0.5, error2: 3 + 0.5 },
        { date: "24-05-2023", species: 4, error: 4 - 0.5, error2: 4 + 0.5 },
        { date: "25-05-2023", species: 2, error: 2 - 0.5, error2: 2 + 0.5 },
        { date: "26-05-2023", species: 6, error: 6 - 0.5, error2: 6 + 0.5 },
      ],
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
    width: 300,
    height: 200,
    data: [
      {
        series: "Government",
        year: 2000,
        month: 9,
        count: 408,
        rate: 2.1,
        date: "2000-09-01T07:00:00.000Z",
      },
      {
        series: "Government",
        year: 2000,
        month: 10,
        count: 391,
        rate: 2,
        date: "2000-10-01T07:00:00.000Z",
      },
    ],
    mark: "area",
    encoding: {
      x: {
        timeUnit: "yearmonth",
        field: "date",
        axis: { format: "%Y" },
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
