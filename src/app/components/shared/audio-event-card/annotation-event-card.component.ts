import { DecimalPipe, PercentPipe, TitleCasePipe } from "@angular/common";
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import { UrlDirective } from "@directives/url/url.directive";
import {
  MediaControlsComponent,
  SpectrogramComponent,
} from "@ecoacoustics/web-components/@types";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Consensus, ConsensusDecision } from "@models/AudioEvent/Consensus";
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
    TitleCasePipe,
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
  protected readonly ratioThreshold = 0.6 satisfies Consensus["ratio"];
  protected readonly ConsensusDecision = ConsensusDecision;

  protected readonly tagInfo = computed<TagInfo[]>(() => {
    return this.annotation().tags.map((tagModel) => {
      // Audio events without any verifications return "null" instead of an
      // object.
      // see: https://github.com/QutEcoacoustics/baw-server/issues/869
      let verificationSummary = (
        this.annotation().verificationSummary ?? []
      ).find((tagSummary) => tagSummary.tagId === tagModel.id);

      if (!verificationSummary) {
        const noVerificationSummary = new VerificationSummary({
          tagId: tagModel.id,
          count: 0,
          correct: 0,
          incorrect: 0,
          unsure: 0,
          skip: 0,
        });

        verificationSummary = noVerificationSummary;
      }

      const color = this.verificationColor(verificationSummary.consensus);

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

  private verificationColor(consensus: Consensus): string {
    const undecidedColor = "#555555"; // gray
    const correctColor = "#1a9850"; // green
    const incorrectColor = "#d73027"; // red

    if (consensus.decision === ConsensusDecision.None) {
      return undecidedColor;
    }

    const rangeEnd =
      consensus.decision === ConsensusDecision.Correct
        ? correctColor
        : incorrectColor;

    // We use red for a high "incorrect" consensus, and green for a high "correct"
    // consensus.
    // In the middle (a consensus ratio of 0.5), we use gray.
    // Note that we should never see a ratio below 0.5, because the ratio is
    // defined as the max(correct, incorrect) / totalResolved.
    const scale = scaleLinear([0.5, 1], [undecidedColor, rangeEnd]);

    return scale(consensus.ratio);
  }
}
