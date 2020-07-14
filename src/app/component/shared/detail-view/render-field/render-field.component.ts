import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { toRelative } from "src/app/interfaces/apiInterfaces";

@Component({
  selector: "baw-render-field",
  template: `
    <ng-container *ngIf="!children; else hasChildren">
      <!-- Display plain text -->
      <dl *ngIf="styling === FieldStyling.Plain">
        <p id="plain" class="m-0">{{ display }}</p>
      </dl>

      <!-- Display code/objects -->
      <dl *ngIf="styling === FieldStyling.Code">
        <pre id="code" class="m-0">{{ display }}</pre>
      </dl>

      <!-- Display checkbox -->
      <dl *ngIf="styling === FieldStyling.Checkbox">
        <baw-checkbox
          id="checkbox"
          class="m-0"
          [checked]="display"
          [disabled]="true"
          [isCentered]="false"
        ></baw-checkbox>
      </dl>

      <!-- Display AbstractModel -->
      <dl *ngIf="styling === FieldStyling.Model">
        <a id="model" [routerLink]="model.viewUrl">{{ model }}</a>
      </dl>

      <!-- Display Image -->
      <dl *ngIf="styling === FieldStyling.Image">
        <img
          id="image"
          style="max-width: 400px; max-height: 400px"
          [src]="display"
          alt="model image alt"
        />
      </dl>
    </ng-container>
    <ng-template #hasChildren>
      <baw-render-field
        id="children"
        *ngFor="let child of children"
        [value]="child"
      ></baw-render-field>
    </ng-template>
  `,
})
export class RenderFieldComponent extends WithUnsubscribe()
  implements OnInit, OnChanges {
  @Input() public value: ModelView;
  public children: ModelView[];
  public display: string | number | boolean;
  public FieldStyling = FieldStyling;
  public model: AbstractModel;
  public styling: FieldStyling = FieldStyling.Plain;
  private errorText = "(error)";
  private loadingText = "(loading)";
  private noValueText = "(no value)";

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.ngOnChanges();
  }

  public ngOnChanges(): void {
    this.humanize(this.value);
  }

  private humanize(value: ModelView) {
    if (!isInstantiated(value)) {
      this.display = this.noValueText;
    } else if (value instanceof DateTime) {
      this.display = humanizeDateTime(value);
    } else if (value instanceof Duration) {
      this.display = `${value.toISO()} (${toRelative(value)})`;
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
      // TODO Handle ImageUrl
      this.humanizeObject(value);
    } else if (typeof value === "boolean") {
      this.styling = FieldStyling.Checkbox;
      this.display = value;
    } else if (typeof value === "string") {
      this.humanizeString(value);
    } else {
      this.display = value.toString();
    }
  }

  /**
   * Convert abstract model to human readable output
   * @param value Display input
   */
  private humanizeAbstractModel(value: AbstractModel) {
    if (value instanceof UnresolvedModel) {
      this.setLoading();
    } else {
      this.styling = FieldStyling.Model;
      this.display = "";
      this.model = value;
    }
  }

  /**
   * Convert string to human readable output. Currently this only checks if the
   * string is an image url.
   * @param value Display input
   */
  private humanizeString(value: string) {
    this.display = value;

    this.isImage(
      value,
      () => {
        // String is image URL, display image
        this.styling = FieldStyling.Image;
        this.display = value;
        this.ref.detectChanges();
      },
      () => {}
    );
  }

  /**
   * Convert object to human readable output
   * @param value Display input
   */
  private humanizeObject(value: object) {
    this.setLoading();

    try {
      this.styling = FieldStyling.Code;
      this.display = JSON.stringify(value);
    } catch (err) {
      this.display = this.errorText;
    }
  }

  /**
   * Convert blob to human readable output
   * @param value Display input
   */
  private humanizeBlob(value: Blob) {
    this.setLoading();
    // TODO Implement new method (https://developer.mozilla.org/en-US/docs/Web/API/Blob/text)
    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      this.styling = FieldStyling.Code;
      this.display = e.target.result.toString();
    });
    reader.onerror = () => {
      this.display = this.errorText;
      reader.abort();
    };
    reader.readAsText(value);
  }

  /**
   * Convert observable to human readable output
   * @param value Display input
   */
  private humanizeObservable(
    value: Observable<AbstractModel | AbstractModel[]>
  ) {
    this.setLoading();
    value.pipe(takeUntil(this.unsubscribe)).subscribe(
      (models) => {
        if (!models) {
          this.display = this.noValueText;
        } else {
          this.humanize(models);
        }
        this.ref.detectChanges();
      },
      () => {
        this.display = this.errorText;
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Convert array to human readable output
   * @param value Display input
   */
  private humanizeArray(value: ModelView[]) {
    if (value.length > 0) {
      this.children = value;
    } else {
      this.display = this.noValueText;
    }
  }

  /**
   * Indicate view is still loading
   */
  private setLoading() {
    this.styling = FieldStyling.Plain;
    this.display = this.loadingText;
  }

  /**
   * Determine if image is valid
   * ! This function is untested, edit carefully
   * @param src Source URL
   * @param validCallback Valid image callback
   * @param invalidCallback Invalid image callback
   */
  private isImage(
    src: string,
    validCallback: () => void,
    invalidCallback: () => void
  ) {
    const img = new Image();
    img.onload = validCallback;
    img.onerror = invalidCallback;
    img.src = src;
  }
}

/**
 * Create a human readable datetime string
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
  | object
  | ModelView[];

enum FieldStyling {
  Checkbox,
  Code,
  Link,
  Plain,
  Route,
  Model,
  Image,
}
