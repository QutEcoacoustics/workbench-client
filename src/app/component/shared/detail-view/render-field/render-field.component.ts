import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
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
        <a [routerLink]="[model.viewUrl]">{{ model.toString() }}</a>
      </dl>
    </ng-container>
    <ng-template #hasChildren>
      <baw-render-field
        *ngFor="let child of children"
        [view]="child"
      ></baw-render-field>
    </ng-template>
  `,
})
export class RenderFieldComponent extends WithUnsubscribe() implements OnInit {
  @Input() view: ModelView;
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

  ngOnInit(): void {
    this.humanize(this.view);
  }

  private humanize(value: ModelView) {
    if (value === null || value === undefined) {
      this.display = this.noValueText;
    } else if (value instanceof DateTime) {
      this.display = `${value.toISO()} (${value.toRelative()})`;
    } else if (value instanceof Duration) {
      this.display = `${value.toISO()} (${toRelative(value)})`;
    } else if (value instanceof Array) {
      this.humanizeArray(value);
    } else if (value instanceof Blob) {
      this.humanizeBlob(value);
    } else if (value instanceof Observable) {
      this.humanizeObservable(value);
    } else if (value instanceof AbstractModel) {
      this.styling = FieldStyling.Model;
      this.display = "";
      this.model = value;
    } else if (typeof value === "object") {
      // TODO Implement optional treeview
      this.humanizeObject(value);
    } else if (typeof value === "boolean") {
      this.styling = FieldStyling.Checkbox;
      this.display = value;
    } else {
      this.display = value.toString();
    }
  }

  /**
   * Convert object to human readable output
   * @param value Display output
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
   * @param value Display output
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

  private humanizeObservable(
    value: Observable<AbstractModel | AbstractModel[]>
  ) {
    this.display = this.loadingText;
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
   * @param value Display output
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
}

type ModelView =
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
}
