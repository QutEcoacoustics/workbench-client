import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
} from "@angular/core";
import { TagAccumulationItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./tagAccumulation.schema.json";

@Component({
  selector: "baw-tag-accumulation",
  template: `
    <baw-chart
      #chart
      [spec]="chartSchema"
      [data]="rows()"
        logContext="Tag accumulation"
    />
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagAccumulationComponent {
  public readonly rows = input.required<TagAccumulationItem[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
