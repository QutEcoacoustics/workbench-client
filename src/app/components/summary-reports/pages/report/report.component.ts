import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  summaryReportCategory,
  summaryReportMenuItem
} from "@components/summary-reports/summary-report.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { Id } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTime, Duration } from "luxon";

const projectKey = "project";

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
  }[]
}

interface AnalysisCoverageDataPoint {
  date: DateTime;
  audioCoverage: number;
  analysisCoverage: number;
}

type Graph =
  AccumulationDataGraph |
  SpeciesCompositionDataGraph |
  AnalysisCoverageDataGraph |
  GraphUrl;

interface Report {
  project: Project;
  region?: Region[];
  sites?: Site[];
  startDate?: DateTime;
  endDate?: DateTime;
  startTime?: Duration;
  endTime?: Duration;
  provenances?: Id[];
  minimumScore: number;
  tags?: Tag[];
  analysisJob: AnalysisJob;
  graphs?: Graph[];
}

interface Row {
  event?: string;
  recogniser: string;
  detections: number;
  daysWithDetections: number;
  daysWithRain: number;
  confidence: number[];
}

@Component({
  selector: "baw-summary-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
class SummaryReportComponent extends PageComponent {
  public constructor(
    public router: Router,
  ) {
    super();
  }

  @ViewChild("printableReport")
  public printableReport: ElementRef;

  public report: Report;

  protected rows: Row[] = [
    {
      event: "Ninox boobook",
      recogniser: "BirdNet",
      detections: 23,
      daysWithDetections: 10,
      daysWithRain: 4,
      confidence: [0.2, 0.3, 0.5],
    },
    {
      recogniser: "Lance's",
      detections: 11,
      daysWithDetections: 1,
      daysWithRain: 4,
      confidence: [0.2, 0.3, 0.5],
    },
    {
      event: "Calyptorhynchus lathami",
      recogniser: "BirdNet",
      detections: 19,
      daysWithDetections: 13,
      daysWithRain: 2,
      confidence: [0.2, 0.3, 0.5],
    },
    {
      recogniser: "Lance's",
      detections: 84,
      daysWithDetections: 11,
      daysWithRain: 5,
      confidence: [0.2, 0.3, 0.5],
    },
    {
      event: "Petaurus australis",
      recogniser: "BirdNet",
      detections: 250,
      daysWithDetections: 200,
      daysWithRain: 30,
      confidence: [0.2, 0.3, 0.5],
    }
  ];

  public printPage(): void {
    window.print();
  }
}

SummaryReportComponent.linkToRoute({
  category: summaryReportCategory,
  menus: {},
  pageRoute: summaryReportMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { SummaryReportComponent }
