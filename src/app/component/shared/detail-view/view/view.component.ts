import { Component, Input, OnInit } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { toRelative } from "src/app/interfaces/apiInterfaces";

@Component({
  selector: "app-view",
  template: `
    <ng-container *ngIf="!children; else hasChildren">
      <pre *ngIf="styling === CodeStyling.Code">{{ display }}</pre>
      <p *ngIf="styling === CodeStyling.Plain">{{ display }}</p>
      <app-checkbox
        *ngIf="styling === CodeStyling.Checkbox"
        [checked]="display"
        [disabled]="true"
        [ngClass]="{}"
      ></app-checkbox>
    </ng-container>
    <ng-template #hasChildren>
      <app-view *ngFor="let child of children" [view]="child"></app-view>
    </ng-template>
  `,
})
export class ViewComponent implements OnInit {
  @Input() view: ModelView;
  public display: string | number | boolean;
  public children: ModelView[];
  public styling: CodeStyling = CodeStyling.Plain;
  public CodeStyling = CodeStyling;
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
      this.humanizeObject(value);
    } else if (typeof value === "boolean") {
      this.styling = CodeStyling.Checkbox;
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
      this.styling = CodeStyling.Code;
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
      this.styling = CodeStyling.Code;
      this.display = e.target.result.toString();
    });
    reader.readAsText(value);
  }

  /**
   * Indicate answer is still loading
   */
  private setLoading() {
    this.styling = CodeStyling.Plain;
    this.display = this.loadingText;
  }
}

type ModelView = any;

enum CodeStyling {
  Checkbox,
  Code,
  Link,
  Plain,
  Route,
}
