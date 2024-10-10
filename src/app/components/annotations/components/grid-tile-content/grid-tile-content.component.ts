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
import { gridTileContext } from "@ecoacoustics/web-components";
import { NgElement, WithProperties } from "@angular/elements";
import { SubjectWrapper } from "@ecoacoustics/web-components/@types/models/subject";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types/components/spectrogram/spectrogram";
import { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";
import { AudioEvent } from "@models/AudioEvent";

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

  protected model = signal<AudioEvent>(undefined);
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

    const contextSize = 30;

    const startTime = this.model().startTimeSeconds;
    const endTime = this.model().endTimeSeconds;

    // TODO: the end time should check that it is less than the duration of the audio file
    const newStart = Math.max(0, startTime - contextSize);
    const newEnd = endTime + contextSize;

    const existingUrl = new URL(this.model().audioLink);
    const searchParams = new URLSearchParams(existingUrl.search);

    searchParams.set("start_offset", newStart.toString());
    searchParams.set("end_offset", newEnd.toString());
    searchParams.delete("audio_event_id");

    const newUrl = new URL(existingUrl.origin + existingUrl.pathname);
    newUrl.search = searchParams.toString();

    return newUrl.toString();
  }

  public ngAfterViewInit(): void {
    this.requestContext();
  }

  public handleContextChange(subjectWrapper: SubjectWrapper): void {
    this.model.set(new AudioEvent(subjectWrapper.subject));
  }

  protected toggleContext(): void {
    this.contextExpanded = !this.contextExpanded;
  }

  private requestContext(): void {
    this.wrapper.nativeElement.dispatchEvent(
      new ContextRequestEvent(
        gridTileContext,
        this.handleContextChange.bind(this),
        true
      )
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "baw-grid-tile-content": NgElement &
      WithProperties<typeof GridTileContentComponent>;
  }
}
