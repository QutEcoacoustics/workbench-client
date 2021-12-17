import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  DateTimeTimezone,
  ImageSizes,
  ImageUrl,
  isImageUrl,
  toRelative,
} from "@interfaces/apiInterfaces";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { Site } from "@models/Site";
import { AbstractModelWithSite } from "@shared/timezone/timezone.component";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface PlainField {
  isPlainField: true;
  text: string;
}

interface DateField {
  isDateField: true;
  date: DateTimeTimezone;
}

interface CodeField {
  isCodeField: true;
  text: string;
}

interface CheckboxField {
  isCheckboxField: true;
  checked: boolean;
}

interface ModelField {
  isModelField: true;
  model: AbstractModel;
}

interface ImageField {
  isImageField: true;
  imageUrls: ImageUrl[];
}

interface NestedField {
  isNestedField: true;
  children: ModelView[];
}

type FieldTypes =
  | PlainField
  | DateField
  | CodeField
  | CheckboxField
  | ModelField
  | ImageField
  | NestedField;

@Component({
  selector: "baw-render-field",
  template: `
    <!-- Display plain text -->
    <dl *ngIf="isPlainField(field)">
      <p id="plain" class="m-0" [innerText]="field.text"></p>
    </dl>

    <!-- Display date -->
    <dl *ngIf="isDateField(field)">
      <baw-timezone
        id="timezone"
        [dateTime]="field.date"
        [site]="model.site"
      ></baw-timezone>
    </dl>

    <!-- Display code/objects -->
    <dl *ngIf="isCodeField(field)">
      <pre id="code" class="m-0" [innerText]="field.text"></pre>
    </dl>

    <!-- Display checkbox -->
    <dl *ngIf="isCheckboxField(field)">
      <baw-checkbox
        id="checkbox"
        class="m-0"
        [checked]="field.checked"
        [disabled]="true"
        [isCentered]="false"
      ></baw-checkbox>
    </dl>

    <!-- Display AbstractModel -->
    <dl *ngIf="isModelField(field)">
      <baw-model-link [model]="field.model">
        <span id="model" [innerText]="field.model.toString()"></span>
        <span id="ghost" [innerText]="field.model.toString()"></span>
      </baw-model-link>
    </dl>

    <!-- Display Image -->
    <dl *ngIf="isImageField(field)">
      <img id="image" alt="model image alt" [src]="field.imageUrls" />
    </dl>

    <!-- Display nested fields -->
    <ng-container *ngIf="isNestedField(field)">
      <baw-render-field
        *ngFor="let child of field.children"
        id="children"
        [value]="child"
      ></baw-render-field>
    </ng-container>
  `,
  styles: [
    `
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
    `,
  ],
})
export class RenderFieldComponent
  extends withUnsubscribe()
  implements OnChanges
{
  @Input() public value: ModelView;
  @Input() public model: AbstractModelWithSite;

  public field: FieldTypes;

  public constructor(private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnChanges(): void {
    this.humanize(this.value);
  }

  public isPlainField = (field: FieldTypes): field is PlainField =>
    (field as PlainField)?.isPlainField;
  public isDateField = (field: FieldTypes): field is DateField =>
    (field as DateField)?.isDateField;
  public isCodeField = (field: FieldTypes): field is CodeField =>
    (field as CodeField)?.isCodeField;
  public isCheckboxField = (field: FieldTypes): field is CheckboxField =>
    (field as CheckboxField)?.isCheckboxField;
  public isModelField = (field: FieldTypes): field is ModelField =>
    (field as ModelField)?.isModelField;
  public isImageField = (field: FieldTypes): field is ImageField =>
    (field as ImageField)?.isImageField;
  public isNestedField = (field: FieldTypes): field is NestedField =>
    (field as NestedField)?.isNestedField;

  private humanize(value: ModelView): void {
    if (!isInstantiated(value)) {
      this.setNoValue();
    } else if (value instanceof DateTime) {
      this.humanizeDateTime(value);
    } else if (value instanceof Duration) {
      this.humanizeDuration(value);
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
      this.field = { isCheckboxField: true, checked: value };
    } else if (typeof value === "string") {
      this.humanizeString(value);
    } else {
      this.field = { isPlainField: true, text: value.toString() };
    }
  }

  /**
   * Convert a duration to human readable output
   *
   * @param value Duration input
   */
  private humanizeDuration(value: Duration): void {
    const formattedDuration = `${value.toISO()} (${toRelative(value)})`;
    this.field = { isPlainField: true, text: formattedDuration };
  }

  /**
   * Convert abstract model to human readable output
   *
   * @param value Abstract model input
   */
  private humanizeAbstractModel(value: AbstractModel): void {
    if (value instanceof UnresolvedModel) {
      return this.setLoading();
    }
    this.field = { isModelField: true, model: value };
  }

  /**
   * Convert string to human readable output. Currently this only checks if the
   * string is an image url.
   *
   * @param value String input
   */
  private humanizeString(value: string): void {
    this.setLoading();

    this.isImage(
      value,
      (): void => {
        // String is image URL, display image
        const imageUrl: ImageUrl = { url: value, size: ImageSizes.unknown };
        this.field = { isImageField: true, imageUrls: [imageUrl] };
        this.ref.detectChanges();
      },
      (): void => {
        this.field = { isPlainField: true, text: value };
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Convert object to human readable output
   *
   * @param value Object input
   */
  private humanizeObject(value: Record<string, any>): void {
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
   * @param value Blob input
   */
  private async humanizeBlob(value: Blob): Promise<void> {
    this.setLoading();

    try {
      this.field = { isCodeField: true, text: await value.text() };
    } catch (err) {
      this.setError();
    }
  }

  /**
   * Convert observable to human readable output
   *
   * @param value Abstract model/s input
   */
  private humanizeObservable(
    value: Observable<AbstractModel | AbstractModel[]>
  ): void {
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
   * @param value Array input
   */
  private humanizeArray(value: ModelView[] | ImageUrl[]): void {
    if (value.length === 0) {
      return this.setNoValue();
    }

    // Check if image urls, or nested fields
    this.field = isImageUrl(value[0])
      ? { isImageField: true, imageUrls: value as ImageUrl[] }
      : { isNestedField: true, children: value };
  }

  /**
   * Create a human readable datetime string
   *
   * @param value DateTime value
   */
  private humanizeDateTime(value: DateTime): void {
    this.field = { isDateField: true, date: value };
  }

  /**
   * Indicate view is still loading
   */
  private setLoading(): void {
    this.field = { isPlainField: true, text: "(loading)" };
    this.ref.detectChanges();
  }

  /**
   * Indicate value is not set
   */
  private setNoValue(): void {
    this.field = { isPlainField: true, text: "(no value)" };
    this.ref.detectChanges();
  }

  /**
   * Indicate value failed to be retrieved
   */
  private setError(): void {
    this.field = { isPlainField: true, text: "(error)" };
    this.ref.detectChanges();
  }

  /**
   * Determine if image is a valid url
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
  ): void {
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
