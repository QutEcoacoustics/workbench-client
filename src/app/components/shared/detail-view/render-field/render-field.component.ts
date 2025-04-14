import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ImageSizes, ImageUrl, isImageUrl } from "@interfaces/apiInterfaces";
import {
  AbstractModel,
  unknownViewUrl,
  UnresolvedModel,
} from "@models/AbstractModel";
import { User } from "@models/User";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { ModelLinkComponent } from "../model-link/model-link.component";
import { AuthenticatedImageDirective } from "../../../../directives/image/image.directive";
import { DurationComponent } from "../../datetime-formats/duration/duration.component";
import { ZonedDateTimeComponent } from "../../datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { TimeSinceComponent } from "../../datetime-formats/time-since/time-since.component";
import { DatetimeComponent } from "../../datetime-formats/datetime/datetime/datetime.component";
import { DetailViewModule } from "../detail-view.module";

@Component({
  selector: "baw-render-field",
  template: `
    <!-- Display plain text -->
    @if (styling === fieldStyling.plain) {
      <dl>
        <p id="plain" class="m-0" [innerText]="display"></p>
      </dl>
    }

    <!-- Display code/objects -->
    @if (styling === fieldStyling.code) {
      <dl>
        <pre id="code" class="m-0" [innerText]="display"></pre>
      </dl>
    }

    <!-- Display checkbox -->
    @if (styling === fieldStyling.checkbox) {
      <dl>
        <baw-checkbox
          id="checkbox"
          class="m-0"
          [checked]="isChecked()"
          [disabled]="true"
          [isCentered]="false"
        ></baw-checkbox>
      </dl>
    }

    <!-- Display AbstractModel -->
    @if (styling === fieldStyling.model) {
      <dl>
        <baw-model-link [model]="model">
          <span id="model" [innerText]="model.toString()"></span>
          <span id="ghost" [innerText]="model.toString()"></span>
        </baw-model-link>
      </dl>
    }

    <!-- Display Image -->
    @if (styling === fieldStyling.image) {
      <dl>
        <img id="image" alt="model image alt" [src]="getSource()" />
      </dl>
    }

    <!-- Display Duration -->
    @if (styling === fieldStyling.duration && isDuration(display)) {
      <dl>
        <baw-duration [value]="display" iso8601 /> (<baw-duration [value]="display" humanized />)
      </dl>
    }

    <!-- Display Date/Time that has an implicit timezone -->
    @if (styling === fieldStyling.zonedDateTime && isDateTime(display)) {
      <dl>
        <baw-zoned-datetime [value]="display" /> (<baw-time-since [value]="display" />)
      </dl>
    }

    <!-- Display Date/Time that should be localized to the users timezone -->
    @if (styling === fieldStyling.dateTime && isDateTime(display)) {
      <dl>
        <baw-datetime [value]="display" /> (<baw-time-since [value]="display" />)
      </dl>
    }

    <!-- Display nested fields -->
    @if (styling === fieldStyling.children) {
      @for (child of children; track child) {
        <baw-render-field id="children" [value]="child"></baw-render-field>
      }
    }
  `,
  styles: [`
    p {
      word-wrap: break-word;
    }

    img {
      display: block;
      max-width: 400px;
      max-height: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  `],
  imports: [
    CheckboxComponent,
    ModelLinkComponent,
    AuthenticatedImageDirective,
    DurationComponent,
    ZonedDateTimeComponent,
    TimeSinceComponent,
    DatetimeComponent,
    DetailViewModule,
  ],
})
export class RenderFieldComponent
  extends withUnsubscribe()
  implements OnChanges
{
  @Input() public value: ModelView;
  public children: ModelView[];
  public display: Display;
  public fieldStyling = FieldStyling;
  public model: AbstractModel;
  public styling: FieldStyling = FieldStyling.plain;

  public constructor(private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnChanges(): void {
    this.humanize(this.value);
  }

  public isChecked(): boolean {
    return this.display as boolean;
  }

  public getSource(): ImageUrl[] {
    return this.display as ImageUrl[];
  }

  // I don't like using "as" for type casting because it just disables TS compiler checks
  // by using a type guard here we can ensure that the type is correct and correctly implicitly type cast Durations
  // in the template
  public isDuration(value): value is Duration {
    return value instanceof Duration;
  }

  public isDateTime(value): value is DateTime {
    return value instanceof DateTime;
  }

  public hasViewUrl() {
    try {
      return (
        isInstantiated(this.model.viewUrl) &&
        this.model.viewUrl !== unknownViewUrl
      );
    } catch (err) {
      return false;
    }
  }

  private humanize(value: ModelView) {
    if (!isInstantiated(value)) {
      this.setNoValue();
    } else if (value instanceof DateTime) {
      // if we have explicitly defined an implicit timezone during the model
      // creation we want to use the zonedDateTime otherwise, we want to use the localized baw-datetime
      // to check if the zone object has been explicitly set, we look at the zone objects "valid" property
      // if the zone has been explicitly set, the zone object will be instantiated with its own "valid" property
      // if the zone is not set, "valid" will come from the objects prototype where "zone" is the users timezone
      if ("valid" in value.zone) {
        this.styling = FieldStyling.zonedDateTime;
      } else {
        this.styling = FieldStyling.dateTime;
      }

      this.display = value;
    } else if (value instanceof Duration) {
      this.styling = FieldStyling.duration;
      this.display = value;
    } else if (value instanceof Array) {
      this.humanizeArray(value);
    } else if (value instanceof Blob) {
      this.humanizeBlob(value);
    } else if (value instanceof Observable) {
      this.humanizeObservable(value);
    } else if (value instanceof AbstractModel) {
      this.humanizeAbstractModel(value);
    } else if (typeof value === "object") {
      // TODO Implement optional treeview
      this.humanizeObject(value);
    } else if (typeof value === "boolean") {
      this.styling = FieldStyling.checkbox;
      this.display = value;
    } else if (typeof value === "string") {
      this.humanizeString(value);
    } else {
      this.display = value.toString();
    }
  }

  public isUser(model: AbstractModel): model is User {
    return (model as User).kind === "User";
  }

  /**
   * Convert abstract model to human readable output
   *
   * @param value Display input
   */
  private humanizeAbstractModel(value: AbstractModel) {
    if (value instanceof UnresolvedModel) {
      this.setLoading();
      return;
    }
    this.styling = FieldStyling.model;
    this.display = "";
    this.model = value;
  }

  /**
   * Convert string to human readable output. Currently this only checks if the
   * string is an image url.
   *
   * @param value Display input
   */
  private humanizeString(value: string) {
    this.setLoading();

    this.isImage(
      value,
      () => {
        // String is image URL, display image
        this.styling = FieldStyling.image;
        this.display = [{ url: value, size: ImageSizes.unknown }];
        this.ref.detectChanges();
      },
      () => {
        this.display = value;
      }
    );
  }

  /**
   * Convert object to human readable output
   *
   * @param value Display input
   */
  private humanizeObject(value: Record<string, any>) {
    this.setLoading();

    try {
      this.display = JSON.stringify(value, null, 4);
      this.styling = FieldStyling.code;
    } catch (err) {
      this.setError();
    }
  }

  /**
   * Convert blob to human readable output
   *
   * @param value Display input
   */
  private async humanizeBlob(value: Blob) {
    this.setLoading();

    try {
      this.display = await value.text();
      this.styling = FieldStyling.code;
    } catch (err) {
      this.setError();
    }
  }

  /**
   * Convert observable to human readable output
   *
   * @param value Display input
   */
  private humanizeObservable(
    value: Observable<AbstractModel | AbstractModel[]>
  ) {
    this.setLoading();

    value.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (models) => {
        this.humanize(models);
        this.ref.detectChanges();
      },
      error: () => this.setError(),
    });
  }

  /**
   * Convert array to human readable output. This also handles
   * an array of image urls.
   *
   * @param value Display input
   */
  private humanizeArray(value: ModelView[] | ImageUrl[]) {
    if (value.length > 0) {
      if (isImageUrl(value[0])) {
        this.styling = FieldStyling.image;
        this.display = value as ImageUrl[];
      } else {
        this.styling = FieldStyling.children;
        this.children = value;
      }
    } else {
      this.setNoValue();
    }
  }

  /**
   * Indicate view is still loading
   */
  private setLoading() {
    this.styling = FieldStyling.plain;
    this.display = "(loading)";
    this.ref.detectChanges();
  }

  private setNoValue() {
    this.styling = FieldStyling.plain;
    this.display = "(no value)";
    this.ref.detectChanges();
  }

  private setError() {
    this.styling = FieldStyling.plain;
    this.display = "(error)";
    this.ref.detectChanges();
  }

  /**
   * Determine if image is valid
   * ! This function is untested, edit carefully
   *
   * @param src Source URL
   * @param validCallback Valid image callback
   * @param invalidCallback Invalid image callback
   */
  private isImage(
    src: string,
    validCallback: () => void,
    invalidCallback: () => void
  ) {
    // Url from https://urlregex.com/
    const urlRegex =
      // eslint-disable-next-line max-len, no-useless-escape
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    if (!urlRegex.test(src)) {
      invalidCallback();
      return;
    }

    const img = new Image();
    img.onload = validCallback;
    img.onerror = invalidCallback;
    img.src = src;
  }
}

/**
 * Create a human readable datetime string
 *
 * @param value DateTime value
 */
export function humanizeDateTime(value: DateTime): string {
  return `${value.toISO()} (${value.toRelative()})`;
}

export type ModelView =
  | undefined
  | string
  | number
  | boolean
  | DateTime
  | Duration
  | AbstractModel
  | Blob
  | Record<string, any>
  | ImageUrl[]
  | ModelView[];

type Display = string | number | boolean | ImageUrl[] | Duration | DateTime;

enum FieldStyling {
  checkbox,
  code,
  plain,
  route,
  model,
  image,
  children,
  duration,
  zonedDateTime,
  dateTime,
}
