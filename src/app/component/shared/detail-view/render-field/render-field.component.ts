import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel, isResolvedModel } from "@models/AbstractModel";
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
        <p class="m-0">{{ display }}</p>
      </dl>

      <!-- Display code/objects -->
      <dl *ngIf="styling === FieldStyling.Code">
        <pre class="m-0">{{ display }}</pre>
      </dl>

      <!-- Display checkbox -->
      <dl *ngIf="styling === FieldStyling.Checkbox">
        <app-checkbox
          class="m-0"
          [checked]="display"
          [disabled]="true"
          [isCentered]="false"
        ></app-checkbox>
      </dl>

      <!-- Display AbstractModel -->
      <dl *ngIf="styling === FieldStyling.Model">
        <a [routerLink]="model.viewUrl">{{ model }}</a>
      </dl>

      <!-- Display Image -->
      <dl *ngIf="styling === FieldStyling.Image">
        <img style="max-width: 400px; max-height: 400px" [src]="display" />
      </dl>
    </ng-container>
    <ng-template #hasChildren>
      <baw-render-field
        *ngFor="let child of children"
        [field]="child"
      ></baw-render-field>
    </ng-template>
  `,
})
export class RenderFieldComponent extends WithUnsubscribe()
  implements OnChanges {
  @Input() field: ModelView;
  public display: string | number | boolean;
  public model: AbstractModel;
  public children: ModelView[];
  public styling: FieldStyling = FieldStyling.Plain;
  public FieldStyling = FieldStyling;
  private errorText = "(error)";
  private loadingText = "(loading)";
  private noValueText = "(no value)";

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(): void {
    this.humanize(this.field);
  }

  private humanize(field: ModelView) {
    if (field === null || field === undefined) {
      this.display = this.noValueText;
    } else if (field instanceof DateTime) {
      this.display = humanizeDateTime(field);
    } else if (field instanceof Duration) {
      this.display = `${field.toISO()} (${toRelative(field)})`;
    } else if (field instanceof Array) {
      this.humanizeArray(field);
    } else if (field instanceof Blob) {
      this.humanizeBlob(field);
    } else if (field instanceof Observable) {
      this.humanizeObservable(field);
    } else if (field instanceof AbstractModel) {
      this.humanizeAbstractModel(field);
    } else if (typeof field === "object") {
      // TODO Implement optional treeview
      this.humanizeObject(field);
    } else if (typeof field === "boolean") {
      this.styling = FieldStyling.Checkbox;
      this.display = field;
    } else if (typeof field === "string") {
      this.humanizeString(field);
    } else {
      this.display = field.toString();
    }
  }

  /**
   * Convert abstract model to human readable output
   * @param field Display input
   */
  private humanizeAbstractModel(field: AbstractModel) {
    if (isResolvedModel(field)) {
      this.styling = FieldStyling.Model;
      this.display = "";
      this.model = field;
    } else {
      this.setLoading();
    }
  }

  /**
   * Convert string to human readable output. Currently this only checks if the
   * string is an image url.
   * @param field Display input
   */
  private humanizeString(field: string) {
    this.display = field;

    this.isImage(
      field,
      () => {
        // String is image URL, display image
        this.styling = FieldStyling.Image;
        this.display = field;
        this.ref.detectChanges();
      },
      () => {}
    );
  }

  /**
   * Convert object to human readable output
   * @param field Display input
   */
  private humanizeObject(field: object) {
    this.setLoading();

    try {
      this.styling = FieldStyling.Code;
      this.display = JSON.stringify(field);
    } catch (err) {
      this.display = this.errorText;
    }
  }

  /**
   * Convert blob to human readable output
   * @param field Display input
   */
  private humanizeBlob(field: Blob) {
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
    reader.readAsText(field);
  }

  /**
   * Convert observable to human readable output
   * @param field Display input
   */
  private humanizeObservable(
    field: Observable<AbstractModel | AbstractModel[]>
  ) {
    this.setLoading();
    field.pipe(takeUntil(this.unsubscribe)).subscribe(
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
   * @param field Display input
   */
  private humanizeArray(field: ModelView[]) {
    if (field.length > 0) {
      this.children = field;
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
