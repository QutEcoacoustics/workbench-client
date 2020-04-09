import { Component, Input, OnInit } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { toRelative } from "src/app/interfaces/apiInterfaces";

@Component({
  selector: "app-render-view",
  template: `
    <ng-container *ngIf="!children; else hasChildren">
      <pre *ngIf="styling === FieldStyling.Code">{{ display }}</pre>
      <p *ngIf="styling === FieldStyling.Plain">{{ display }}</p>
      <app-checkbox
        *ngIf="styling === FieldStyling.Checkbox"
        [checked]="display"
        [disabled]="true"
        [isCentered]="false"
      ></app-checkbox>
    </ng-container>
    <ng-template #hasChildren>
      <app-render-view
        *ngFor="let child of children"
        [view]="child"
      ></app-render-view>
    </ng-template>
  `,
})
export class RenderViewComponent implements OnInit {
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
      this.children = value;
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
   * @param answer Answer output
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
   * @param answer Answer output
   */
  private humanizeBlob(value: Blob) {
    this.setLoading();
    // TODO Implement new method (https://developer.mozilla.org/en-US/docs/Web/API/Blob/text)
    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      this.styling = FieldStyling.Code;
      this.display = e.target.result.toString();
    });
    reader.readAsText(value);
  }

  /**
   * Indicate view is still loading
   */
  private setLoading() {
    this.styling = FieldStyling.Plain;
    this.display = this.loadingText;
  }
}

type ModelView = any;

enum FieldStyling {
  Checkbox,
  Code,
  Link,
  Plain,
  Route,
}
