import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
} from "@angular/core";
import { TagAccumulationItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./speciesAccumulationCurve.schema.json";

@Component({
  selector: "baw-species-accumulation-curve",
  template: `
    <baw-chart
      #chart
      [spec]="chartSchema"
      [data]="rows()"
      logContext="Species accumulation"
    />
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesAccumulationCurveComponent {
  public readonly rows = input.required<TagAccumulationItem[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
