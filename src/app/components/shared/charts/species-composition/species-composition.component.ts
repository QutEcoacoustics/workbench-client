import { ChangeDetectionStrategy, Component, input, viewChild } from "@angular/core";
import { Id, Param } from "@interfaces/apiInterfaces";
import { Tag } from "@models/Tag";
import { ChartComponent } from "@shared/chart/chart.component";
import { Map } from "immutable";
import chartSchema from "./speciesCompositionCurve.schema.json";

export interface SpeciesCompositionGraphData {
  date: Param;
  tagId: Id<Tag>;
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
  public readonly formatter = input.required<(tagId: Id<Tag>) => string>();

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartSchema = Map(chartSchema);
}
