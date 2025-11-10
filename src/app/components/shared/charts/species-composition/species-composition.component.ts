import { Map } from "immutable";
import { ChangeDetectionStrategy, Component, input, viewChild } from "@angular/core";
import { ChartComponent } from "@shared/chart/chart.component";
import { Id, Param } from "@interfaces/apiInterfaces";
import chartSchema from "./speciesCompositionCurve.schema.json";

export interface SpeciesCompositionGraphData {
  date: Param;
  tagId: Id;
  ratio: number;
}

@Component({
  selector: "baw-species-composition-graph",
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
export class SpeciesCompositionGraphComponent {
  public readonly data = input.required<SpeciesCompositionGraphData[]>();
  public readonly formatter = input.required<(tagId: Id) => string>();

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
