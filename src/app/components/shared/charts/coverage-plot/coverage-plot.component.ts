import { ChangeDetectionStrategy, Component, input, viewChild } from "@angular/core";
import { IDateRange } from "@models/Provenance/ReportGraphs";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./coveragePlot.schema.json";

export interface CoverageGraphData {
  failedAnalysisCoverage: IDateRange[];
  analysisCoverage: IDateRange[];
  missingAnalysisCoverage: IDateRange[];
  recordingCoverage: IDateRange[];
}

@Component({
  selector: "baw-coverage-plot",
  template: `
    <baw-chart #chart [spec]="chartSchema" [datasets]="data()" />
 `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoveragePlotComponent {
  public readonly data = input.required<CoverageGraphData>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
