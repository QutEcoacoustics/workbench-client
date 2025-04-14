import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { SubjectWrapper } from "@ecoacoustics/web-components/@types/models/subject";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { gridTileContext } from "@ecoacoustics/web-components/dist/components/helpers/constants/contextTokens";
import { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";
import { Annotation } from "@models/data/Annotation";
import {
  ContextSubscription,
  WithContext,
} from "@helpers/context/context-decorators";

export const gridTileContentSelector = "baw-grid-tile-content";

@Component({
  selector: "baw-ng-grid-tile-content",
  templateUrl: "grid-tile-content.component.html",
  styleUrl: "grid-tile-content.component.scss",
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GridTileContentComponent implements WithContext {
  public constructor(
    public elementRef: ElementRef,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  @ViewChild("contextSpectrogram")
  private contextSpectrogram: ElementRef<SpectrogramComponent>;

  @ViewChild("contextMediaControls")
  private contextMediaControls: ElementRef<MediaControlsComponent>;

  protected model = signal<Annotation>(undefined);
  protected contextExpanded = false;

  public get listenLink(): string {
    return this.model()?.viewUrl;
  }

  public get contextSpectrogramId(): string {
    return `spectrogram-${this.model()?.id}-context`;
  }

  public get contextSource(): string {
    if (!this.model()) {
      return "";
    }

    const contextSize = 30 as const;
    return this.model().contextUrl(contextSize);
  }

  @ContextSubscription(gridTileContext)
  public handleContextChange(subjectWrapper: SubjectWrapper): void {
    this.contextExpanded = false;
    this.model.set(subjectWrapper.subject as any);
  }

  protected toggleContext(): void {
    this.contextExpanded = !this.contextExpanded;
  }

  protected closeContext(): void {
    this.contextExpanded = false;
  }

  protected contextSpectrogramLoaded(): void {
    this.contextMediaControls.nativeElement.for = this.contextSpectrogramId;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "baw-grid-tile-content": NgElement &
      WithProperties<typeof GridTileContentComponent>;
  }
}
