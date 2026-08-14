import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from "@angular/core";
import { TagFrequencyReportItem } from "@models/Reports";
import { ChartComponent } from "@shared/chart/chart.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { Map as ImmutableMap } from "immutable";
import { type EmbedOptions } from "vega-embed";
import { createTagFormatter, resolveTags } from "../resolve-tags";
import { flattenFrequencyRows } from "../tag-frequency/tag-frequency.component";
import baseChartSchema from "./tagFrequencyStacked.schema.json";

@Component({
  selector: "baw-tag-frequency-stacked",
  template: `
    @if (tags()) {
      @if (chartSchema(); as resolvedChartSchema) {
        <baw-chart
          #chart
          [spec]="resolvedChartSchema"
          [data]="chartRows()"
          [formatter]="tagFormatter"
          [options]="chartOptions"
          logContext="Tag frequency stacked"
        />
      } @else {
        <baw-loading />
      }
    } @else {
      <baw-loading />
    }
  `,
  styleUrl: "../charts.component.scss",
  imports: [ChartComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFrequencyStackedComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  public readonly rows = input.required<TagFrequencyReportItem[]>();
  private readonly measuredWidth = signal<number | undefined>(undefined);
  private resizeObserver?: ResizeObserver;

  protected readonly tags = resolveTags(this.rows);
  protected readonly tagFormatter = createTagFormatter(this.tags);
  protected readonly chartOptions: EmbedOptions = {
    actions: false,
    config: {
      autosize: {
        type: "pad",
        contains: "padding",
        resize: true,
      },
    },
  };

  public readonly chart = viewChild.required<ChartComponent>("chart");

  protected readonly chartRows = computed(() =>
    flattenFrequencyRows(this.rows()),
  );

  protected readonly chartSchema = computed(() => {
    const width = this.measuredWidth();

    if (!width) {
      return undefined;
    }

    return ImmutableMap({
      ...baseChartSchema,
      spec: {
        ...baseChartSchema.spec,
        width,
      },
    });
  });

  public ngAfterViewInit(): void {
    const updateWidth = () => {
      const width = Math.floor(
        this.elementRef.nativeElement.getBoundingClientRect().width,
      );

      if (width > 0) {
        this.measuredWidth.set(width);
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
      }
    };

    updateWidth();

    if (!this.measuredWidth()) {
      this.resizeObserver = new ResizeObserver(updateWidth);
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  public ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
