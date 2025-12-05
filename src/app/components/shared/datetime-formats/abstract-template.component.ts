import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  input,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTime, Duration } from "luxon";

type InputTypes = DateTime | Date | Duration | string;

@Component({
  templateUrl: "./abstract-template.component.html",
  imports: [NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractTemplateComponent<
  InputType extends InputTypes,
  NormalizedType
> implements OnChanges
{
  // we use a transform function on the [input] prop so that we can change the shape of the input
  // to a uniform type. This allows us to take multiple types as input and convert them into a single type
  // eg. the [input] can take a Luxon DateTime, JS Date, or string and convert this.value into a Luxon DateTime
  public readonly value = input.required<NormalizedType, InputType>({
    transform: (newValue) => this.normalizeValue(newValue),
  });

  /**
   * @description
   * Whether to show a tooltip with "rich" date time information on hover.
   * If this input is unset (false), no tooltip will be shown and the
   * `.has-context` styling (underline) indicating that there is an action on
   * hover will not be applied.
   *
   * @default true
   */
  public readonly withTooltip = input(true);

  // the ISO dateTime is used in the <time> elements "datetime" attribute
  // this attribute is used by screen readers and web scrapers to determine the date and time
  protected isoDateTime: string;
  protected documentText: string;
  protected tooltipText: string;
  protected suffix: string;

  /**
   * A method that should update formattedValue, tooltipValue, and rawDateTime
   * before each change detection cycle
   */
  public ngOnChanges(): void {
    this.update();
  }

  protected abstract normalizeValue(value: InputType): NormalizedType;
  public abstract update(): void;

  protected static readonly TOOLTIP_DATETIME = "yyyy-MM-dd HH:mm:ss.SSS";
}
