import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { gridTileContext } from "@ecoacoustics/web-components/dist/components/helpers/constants/contextTokens";
import { Annotation } from "@models/data/Annotation";
import { MediaControlsComponent, VerificationGridTileContext } from "@ecoacoustics/web-components/@types";
import {
  ContextSubscription,
  WithContext,
} from "@helpers/context/context-decorators";

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
  public readonly elementRef = inject(ElementRef);
  public readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly contextSpectrogram =
    viewChild<ElementRef<SpectrogramComponent>>("contextSpectrogram");
  private readonly contextMediaControls =
    viewChild<ElementRef<MediaControlsComponent>>("contextMediaControls");

  protected readonly model = signal<Annotation>(undefined);
  protected readonly contextExpanded = signal(false);

  protected get listenLink(): string {
    return this.model()?.viewUrl;
  }

  protected get contextSource(): string {
    if (!this.model()) {
      return "";
    }

    const contextSize = 30;
    return this.model().contextUrl(contextSize);
  }

  @ContextSubscription(gridTileContext)
  public handleContextChange(tile: VerificationGridTileContext): void {
    // TODO: Remove this guard once we fix upstream issues
    // https://github.com/ecoacoustics/web-components/issues/532
    if (tile === undefined) {
      return;
    }

    this.contextExpanded.set(false);
    const model = tile.model;

    // We need this "as any" to remove the "readonly" type from the subject.
    // TODO: Remove this type cast once we fix upstream typings
    // see: https://github.com/ecoacoustics/web-components/issues/512
    this.model.set(model.subject as any);
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
