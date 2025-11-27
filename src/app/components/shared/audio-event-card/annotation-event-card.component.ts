import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import { Annotation } from "@models/data/Annotation";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
  MediaControlsComponent,
  SpectrogramComponent,
} from "@ecoacoustics/web-components/@types";
import { LoadingComponent } from "@shared/loading/loading.component";
import { DecimalPipe } from "@angular/common";
import { isInstantiatedPipe } from "@pipes/is-instantiated/is-instantiated.pipe";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { UrlDirective } from "@directives/url/url.directive";
import { ZonedDateTimeComponent } from "../datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { IsUnresolvedPipe } from "../../../pipes/is-unresolved/is-unresolved.pipe";
import { VerificationSummary } from "@models/AudioEvent/VerificationSummary";

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
  private readonly spectrogram =
    viewChild<ElementRef<SpectrogramComponent>>("spectrogram");

  protected readonly tagInfo = computed(() => {
    return this.annotation().tags.map((tagModel) => {
      // Audio events without any verifications return "null" instead of an
      // object.
      // see: https://github.com/QutEcoacoustics/baw-server/issues/869
      let verificationStatus = (this.annotation().verificationSummary ?? []).find(
        (tagSummary) => tagSummary.tagId === tagModel.id
      );

      if (!verificationStatus) {
        const noVerificationSummary = new VerificationSummary({
          tagId: tagModel.id,
          count: 0,
          correct: 0,
          incorrect: 0,
          unsure: 0,
          skip: 0,
        });

        verificationStatus = noVerificationSummary;
      }

      console.log(verificationStatus.correct);

      return {
        ...tagModel,
        viewUrl: tagModel.viewUrl,
        verificationStatus: verificationStatus,
      };
    });
  });

  public constructor() {
    // Use effect() to link media controls to the spectrogram when it becomes
    // available. This is necessary because the spectrogram is inside a @defer
    // block and won't exist until the element enters the viewport.
    effect(() => {
      const spectrogramElement = this.spectrogram();
      const mediaControlsElement = this.mediaControls();

      if (spectrogramElement && mediaControlsElement) {
        mediaControlsElement.nativeElement.for = spectrogramElement.nativeElement;
      }
    });
  }
}
