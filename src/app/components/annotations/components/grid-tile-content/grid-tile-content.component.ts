import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Injector,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ContextRequestEvent } from "@helpers/context/context";
import { Verification } from "@models/Verification";
import { gridTileContext } from "@ecoacoustics/web-components";
import {
  createCustomElement,
  NgElement,
  WithProperties,
} from "@angular/elements";
import { SubjectWrapper } from "@ecoacoustics/web-components/@types/models/subject";

const elementSelector = "baw-grid-tile-content" as const;

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: elementSelector,
  templateUrl: "grid-tile-content.component.html",
  styleUrl: "grid-tile-content.component.scss",
})
export class GridTileContentComponent implements AfterViewInit {
  public constructor(injector: Injector) {
    const isCustomElementRegistered = customElements.get(elementSelector);

    if (!isCustomElementRegistered) {
      const webComponentElement = createCustomElement(
        GridTileContentComponent,
        { injector }
      );
      customElements.define(elementSelector, webComponentElement);
    }
  }

  @ViewChild("wrapper")
  private wrapper: ElementRef<HTMLDivElement>;

  protected model = signal<Verification>(undefined);
  protected contextExpanded = false;

  public get listenLink(): string {
    if (!this.model()) {
      return "";
    }

    return this.model().viewUrl;
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
    this.model.set(new Verification(subjectWrapper.subject));
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
