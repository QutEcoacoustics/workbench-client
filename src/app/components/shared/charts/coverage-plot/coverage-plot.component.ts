import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import {
  AnalysisCoverageItem,
  AudioRecordingCoverageItem,
} from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { Map as ImmutableMap } from "immutable";
import { resolveSites } from "../resolve-sites";
import chartSchema from "./coveragePlot.schema.json";

interface CoverageChartRow {
  siteId: number;
  siteName: string;
  range: AudioRecordingCoverageItem["range"];
  density: number;
  coverageType: string;
}

export interface CoverageGraphData {
  coverage: CoverageChartRow[];
}

@Component({
  selector: "baw-coverage-plot",
  template: `
    @if (sites()) {
      <baw-chart
        #chart
        [spec]="chartSchema"
        [datasets]="data()"
        logContext="Coverage plot"
      />
    } @else {
      <baw-loading />
    }
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoveragePlotComponent {
  public readonly recordingCoverage =
    input.required<AudioRecordingCoverageItem[]>();
  public readonly analysisCoverage = input.required<AnalysisCoverageItem[]>();
  public readonly chart = viewChild.required<ChartComponent>("chart");

  private readonly allCoverage = computed(() => [
    ...this.recordingCoverage(),
    ...this.analysisCoverage(),
  ]);

  protected readonly sites = resolveSites(this.allCoverage);

  protected readonly data = computed<CoverageGraphData>(() => {
    const sites = this.sites();
    const toRow = (
      item: AudioRecordingCoverageItem,
      coverageType: string,
    ): CoverageChartRow => ({
      siteId: item.siteId,
      siteName: sites?.get(item.siteId)?.name ?? `Site ${item.siteId}`,
      range: item.range,
      density: item.density,
      coverageType,
    });

    return {
      coverage: [
        ...this.recordingCoverage().map((item) => toRow(item, "Recordings")),
        ...this.analysisCoverage().map((item) => toRow(item, item.result)),
      ],
    };
  });

  protected readonly chartSchema = ImmutableMap(chartSchema);
}
