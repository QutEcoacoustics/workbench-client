import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import { MediaControlsComponent } from "@ecoacoustics/web-components/@types/components/media-controls/media-controls";
import { Annotation } from "@models/data/Annotation";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { SpectrogramComponent } from "@ecoacoustics/web-components/@types";
import { LoadingComponent } from "@shared/loading/loading.component";
import { DecimalPipe } from "@angular/common";
import { isInstantiatedPipe } from "@pipes/is-instantiated/is-instantiated.pipe";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { UrlDirective } from "@directives/url/url.directive";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { ZonedDateTimeComponent } from "../datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { IsUnresolvedPipe } from "../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
  selector: "baw-annotation-event-card",
  templateUrl: "./annotation-event-card.component.html",
  styleUrl: "./annotation-event-card.component.scss",
  imports: [
    FaIconComponent,
    ZonedDateTimeComponent,
    LoadingComponent,
    NgbTooltip,
    IsUnresolvedPipe,
    isInstantiatedPipe,
    DecimalPipe,
    UrlDirective,
    InlineListComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnnotationEventCardComponent {
  public readonly annotation = input.required<Annotation>();

  // Note that there is no { static: true } option for viewChild signals.
  // This is on purpose, because signals are supposed to be able to
  // automatically detect non-changes.
  // https://github.com/angular/angular/issues/54376
  private readonly mediaControls =
    viewChild<ElementRef<MediaControlsComponent>>("mediaControls");
  private readonly spectrogramRef =
    viewChild<ElementRef<SpectrogramComponent>>("spectrogram");

  public constructor() {
    effect(() => {
      this.mediaControls().nativeElement.for = this.spectrogramRef().nativeElement;
    });
  }
}
