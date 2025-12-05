import { DecimalPipe, PercentPipe } from "@angular/common";
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect, ElementRef,
  input,
  viewChild
} from "@angular/core";
import { UrlDirective } from "@directives/url/url.directive";
import {
  MediaControlsComponent,
  SpectrogramComponent,
} from "@ecoacoustics/web-components/@types";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { VerificationSummary } from "@models/AudioEvent/VerificationSummary";
import { Annotation } from "@models/data/Annotation";
import { Tag } from "@models/Tag";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { isInstantiatedPipe } from "@pipes/is-instantiated/is-instantiated.pipe";
import { LoadingComponent } from "@shared/loading/loading.component";
import { scaleLinear } from "d3-scale";
import { IsUnresolvedPipe } from "../../../pipes/is-unresolved/is-unresolved.pipe";
import { ZonedDateTimeComponent } from "../datetime-formats/datetime/zoned-datetime/zoned-datetime.component";

interface TagInfo {
  tag: Tag;
  verificationSummary: VerificationSummary;
  color: string;
}

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
    PercentPipe,
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

  /**
   * @summary
   * The consensus ratio threshold need to show a verified icon next to a tag.
   *
   * We show a check or a cross icon depending on if this tag has been
   * confirmed as "correct" or "incorrect".
   * However, we require a consensus ratio of over 66% to show these
   * so that we only show this verified tick if there is strong
   * agreement.
   *
   * I have chosen 66% so that if there is a disagreement between 2
   * verifiers who have opposing opinions, we do not show an icon.
   * However, a third verifier can break the tie to show a verified icon
   * because this will cause a 2/3 consensus (66.66...%).
   *
   * Additionally, if there are 5 verifiers, a 4-1 vote will also show
   * a verified icon (80% consensus), but a 3-2 vote (60% consensus)
   * will not show an icon (which seems reasonable).
   *
   * TODO: I'm sure there's some UX research on what consensus ratio
   * is appropriate to show verification ticks, however, I have not
   * looked for this research yet.
   */
  protected readonly upperRatioThreshold = 0.6;
  // We use 0.34 instead of 0.33 here because the "incorrect" ratio uses the
  // "less than" operator to determine if it meets the threshold, meaning that
  // if we used 0.33 exactly, a 2-1 "incorrect" vote (33.33...% correct) would
  // not be able to show an incorrect icon.
  // By using 0.34, we ensure that a 2-1 incorrect vote will show the incorrect
  // icon as expected.
  //
  // Warning: This does provide a small edge case for a VERY large number of
  // users where showing the "incorrect" icon may incorrectly show 0.01% too
  // early.
  // However, I have determined that this edge case is acceptable given that there
  protected readonly lowerRatioThreshold = 0.34;

  protected readonly tagInfo = computed<TagInfo[]>(() => {
    return this.annotation().tags.map((tagModel) => {
      const verificationSummary = this.annotation().verificationSummary.find(
        (tagSummary) => tagSummary.tagId === tagModel.id,
      );

      const color = this.verificationColor(
        verificationSummary.correctConsensus,
        verificationSummary.resolvedDecisionCount,
      );

      return {
        tag: tagModel,
        verificationSummary,
        color,
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
        mediaControlsElement.nativeElement.for =
          spectrogramElement.nativeElement;
      }
    });
  }

  private verificationColor(
    consensusRatio: number,
    decisionCount: number,
  ): string {
    const undecidedColor = "#555555"; // gray
    const correctColor = "#1a9850"; // green
    const incorrectColor = "#d73027"; // red

    if (decisionCount === 0) {
      return undecidedColor;
    }

    // We use red for a high "incorrect" consensus, and green for a high "correct"
    // consensus.
    // In the middle (a consensus ratio of 0.5), we use gray.
    const scale = scaleLinear(
      [0, 0.5, 1],
      [incorrectColor, undecidedColor, correctColor],
    );

    return scale(consensusRatio);
  }
}
