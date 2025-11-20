import { Map } from "immutable";
import { ChangeDetectionStrategy, Component, input, viewChild } from "@angular/core";
import { ChartComponent } from "@shared/chart/chart.component";
import { Param } from "@interfaces/apiInterfaces";
import chartSchema from "./speciesAccumulationCurve.schema.json";

export interface SpeciesAccumulationGraphData {
  date: Param;
  count: number;
  error: number;
}

@Component({
  selector: "baw-species-accumulation-curve",
  template: `
    <baw-chart #chart [spec]="chartSchema" [data]="data()" />
 `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesAccumulationCurveComponent {
  public readonly data = input.required<SpeciesAccumulationGraphData[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
