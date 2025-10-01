import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { gridTileContext } from "@ecoacoustics/web-components/dist/components/helpers/constants/contextTokens";
import { Annotation } from "@models/data/Annotation";
import {
  ContextSubscription,
  WithContext,
} from "@helpers/context/context-decorators";
import { SpectrogramComponent, MediaControlsComponent } from "@ecoacoustics/web-components/@types";
import { SubjectWrapper } from "@ecoacoustics/web-components/@types/models/subject";

export const gridTileContentSelector = "baw-grid-tile-content";

@Component({
  selector: "baw-ng-grid-tile-content",
  templateUrl: "./grid-tile-content.component.html",
  styleUrl: "./grid-tile-content.component.scss",
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GridTileContentComponent implements WithContext {
  public constructor(
    public elementRef: ElementRef,
    public changeDetectorRef: ChangeDetectorRef,
  ) {}

  private contextSpectrogram =
    viewChild<ElementRef<SpectrogramComponent>>("contextSpectrogram");
  private contextMediaControls =
    viewChild<ElementRef<MediaControlsComponent>>("contextMediaControls");

  protected model = signal<Annotation>(undefined);
  protected contextExpanded = signal(false);

  public get listenLink(): string {
    return this.model()?.viewUrl;
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
    this.contextExpanded.set(false);
    this.model.set(subjectWrapper.subject as any);
  }

  protected toggleContext(): void {
    this.contextExpanded.update((value) => !value);
  }

  protected contextSpectrogramLoaded(): void {
    this.contextMediaControls().nativeElement.for = this.contextSpectrogram().nativeElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "baw-grid-tile-content": NgElement &
      WithProperties<typeof GridTileContentComponent>;
  }
}
