import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ContextRequestEvent } from "@helpers/context/context";
import { NgElement, WithProperties } from "@angular/elements";
import type { SubjectWrapper } from "@ecoacoustics/web-components/@types/models/subject";
import type { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import type { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";
import { Annotation } from "@models/data/Annotation";

export const gridTileContextSelector = "baw-grid-tile-content" as const;

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: "baw-ng-grid-tile-content",
  templateUrl: "grid-tile-content.component.html",
  styleUrl: "grid-tile-content.component.scss",
})
export class GridTileContentComponent implements AfterViewInit {
  @ViewChild("wrapper")
  private wrapper: ElementRef<HTMLDivElement>;

  @ViewChild("context-spectrogram")
  private contextSpectrogram: ElementRef<SpectrogramComponent>;

  @ViewChild("context-media-controls")
  private contextMediaControls: ElementRef<MediaControlsComponent>;

  protected model = signal<Annotation>(undefined);
  protected contextExpanded = false;

  public get listenLink(): string {
    if (!this.model()) {
      return "";
    }

    return this.model().viewUrl;
  }

  public get contextSpectrogramId(): string {
    return `spectrogram-${this.model().id}-context`;
  }

  public get contextSource(): string {
    if (!this.model()) {
      return "";
    }

    const contextSize = 30 as const;
    return this.model().contextUrl(contextSize);
  }

  public ngAfterViewInit(): void {
    this.requestContext();
  }

  public handleContextChange(subjectWrapper: SubjectWrapper): void {
    this.contextExpanded = false;
    this.model.set(subjectWrapper.subject as any);
  }

  protected toggleContext(): void {
    this.contextExpanded = !this.contextExpanded;
  }

  private async requestContext(): Promise<void> {
    // TODO: remove this once @ecoacoustics/web-components#219 is resolved
    const webComponents = await import("@ecoacoustics/web-components");
    const token = webComponents.gridTileContext;

    this.wrapper.nativeElement.dispatchEvent(
      new ContextRequestEvent(token, this.handleContextChange.bind(this), true)
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "baw-grid-tile-content": NgElement &
      WithProperties<typeof GridTileContentComponent>;
  }
}
