import { Component, Input, OnChanges } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTime, Duration } from "luxon";

type InputTypes = DateTime | Date | Duration | string;

@Component({
  templateUrl: "./abstract-template.component.html",
  standalone: true,
  imports: [NgbTooltipModule],
})
export abstract class AbstractTemplateComponent<
  InputType extends InputTypes,
  NormalizedType
> implements OnChanges
{
  public constructor() {}

  // we use getters and setters on the [input] prop so that we can change the shape of the input
  // to a uniform type. This allows us to take multiple types as input and convert them into a single type
  // eg. the [input] can take a Luxon DateTime, JS Date, or string and convert this.value into a Luxon DateTime
  @Input({ required: true })
  public set value(value: InputType) {
    this._value = this.normalizeValue(value);
  }

  public get value(): NormalizedType {
    return this._value;
  }

  // the ISO dateTime is used in the <time> elements "datetime" attribute
  // this attribute is used by screen readers and web scrapers to determine the date and time
  public isoDateTime: string;
  public documentText: string;
  public tooltipText: string;
  public suffix = "";
  private _value: NormalizedType;

  /**
   * A method that should update formattedValue, tooltipValue, and rawDateTime
   * before each change detection cycle
   */

  public ngOnChanges(): void {
    this.update();
  }

  protected abstract normalizeValue(value: InputType): NormalizedType;
  public abstract update(): void;

  protected static readonly TOOLTIP_DATETIME = "yyyy-MM-dd HH:mm:ss.SSS" as const;
}
