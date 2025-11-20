import { ChangeDetectionStrategy, Component, input, viewChild } from "@angular/core";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./confidencePlot.schema.json";

@Component({
  selector: "baw-confidence-plot",
  template: `
    <baw-chart #chart [spec]="chartSchema" [data]="data()" />
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfidencePlotComponent {
  public readonly data = input.required<number[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
