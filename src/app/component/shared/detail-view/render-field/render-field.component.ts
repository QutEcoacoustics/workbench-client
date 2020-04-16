import { Component, Input, OnInit } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { toRelative } from "src/app/interfaces/apiInterfaces";

@Component({
  selector: "baw-render-field",
  template: `
    <ng-container *ngIf="!children; else hasChildren">
      <dl *ngIf="styling === FieldStyling.Plain">
        <p>{{ display }}</p>
      </dl>
      <dl *ngIf="styling === FieldStyling.Code">
        <pre>{{ display }}</pre>
      </dl>
      <dl *ngIf="styling === FieldStyling.Checkbox">
        <app-checkbox
          [checked]="display"
          [disabled]="true"
          [isCentered]="false"
        ></app-checkbox>
      </dl>
    </ng-container>
    <ng-template #hasChildren>
      <baw-render-field
        *ngFor="let child of children"
        [view]="child"
      ></baw-render-field>
    </ng-template>
  `,
  styles: [
    `
      dl {
        margin: 0px;
      }
    `,
  ],
})
export class RenderFieldComponent implements OnInit {
  @Input() view: ModelView;
  public display: string | number | boolean;
  public children: ModelView[];
  public styling: FieldStyling = FieldStyling.Plain;
  public FieldStyling = FieldStyling;
  private errorText = "(error)";
  private loadingText = "(loading)";
  private noValueText = "(no value)";

  constructor() {}

  ngOnInit(): void {
    this.humanize(this.view);
  }

  private humanize(value: any) {
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
  | Blob
  | object
  | ModelView[];

enum FieldStyling {
  Checkbox,
  Code,
  Link,
  Plain,
  Route,
}
