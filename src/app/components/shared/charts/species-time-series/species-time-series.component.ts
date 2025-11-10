import { Map } from "immutable";
import { ChangeDetectionStrategy, Component, input, viewChild } from "@angular/core";
import { ChartComponent } from "@shared/chart/chart.component";
import { Id, Param } from "@interfaces/apiInterfaces";
import { Tag } from "@models/Tag";
import chartSchema from "./speciesTimeSeries.schema.json";

export interface SpeciesTimeSeriesGraphData {
  date: Param;
  tagId: Id<Tag>;
  ratio: number;
}

@Component({
  selector: "baw-species-time-series",
  template: `
    <baw-chart
      #chart
      [spec]="chartSchema"
      [data]="data()"
      [formatter]="formatter()"
    />
 `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeciesTimeSeriesComponent {
  public readonly data = input.required<SpeciesTimeSeriesGraphData[]>();
  public readonly formatter = input.required<(tagId: Id<Tag>) => string>();

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
