import { Component, Input, OnInit } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { isUninitialized } from "src/app/helpers";
import { humanizeDuration } from "src/app/interfaces/apiInterfaces";
import { ListDetailValue } from "../question-answer.component";

@Component({
  selector: "app-answer",
  template: `
    <ng-container *ngIf="!children; else hasChildren">
      <p *ngIf="!loading; else isLoading">
        <a *ngIf="route; else plainText" [routerLink]="[route]">
          {{ value }}
        </a>
        <ng-template #plainText>
          <pre *ngIf="codeStyling">{{ value }}</pre>
          <span *ngIf="!codeStyling">{{ value }}</span>
        </ng-template>
      </p>
      <ng-template #isLoading>
        <p id="loading">{{ loadingText }}</p>
      </ng-template>
    </ng-container>
    <ng-template #hasChildren>
      <app-answer *ngFor="let child of children" [detail]="child"></app-answer>
    </ng-template>
  `
})
export class AnswerComponent implements OnInit {
  @Input() detail: ListDetailValue;
  public children: ListDetailValue[];
  public codeStyling: boolean;
  public loading: boolean;
  public loadingText = "(loading)";
  public route: string;
  public value: string;
  private errorText = "(error)";
  private noValueText = "(no value)";

  constructor() {}

  ngOnInit(): void {
    this.humanize(this.detail.value);
  }

  /**
   * Convert answer to a human readable output
   * @param answer Answer output
   */
  private humanize(answer: any) {
    if (this.detail.route) {
      this.route = this.detail.route;
    }

    if (isUninitialized(answer)) {
      this.value = this.noValueText;
    } else if (answer instanceof Observable) {
      this.humanizeObservable(answer);
    } else if (answer instanceof DateTime) {
      this.value = answer.toISO() + " (" + answer.toRelative() + ")";
    } else if (answer instanceof Duration) {
      this.value = humanizeDuration(answer);
    } else if (answer instanceof Array) {
      this.children = answer;
    } else if (answer instanceof Blob) {
      this.humanizeBlob(answer);
    } else if (typeof answer === "object") {
      this.humanizeObject(answer);
    } else {
      this.value = answer.toString();
    }
  }

  /**
   * Convert object to human readable output
   * @param answer Answer output
   */
  private humanizeObject(answer: object) {
    this.codeStyling = true;
    try {
      this.value = JSON.stringify(answer);
    } catch (err) {
      this.value = this.errorText;
    }
  }

  /**
   * Convert blob to human readable output
   * @param answer Answer output
   */
  private humanizeBlob(answer: Blob) {
    this.loading = true;
    this.codeStyling = true;

    // Cross browser compatibility
    if (answer.text) {
      // New method (https://developer.mozilla.org/en-US/docs/Web/API/Blob/text)
      answer
        .text()
        .then(text => {
          this.loading = false;
          this.value = text;
        })
        .catch(() => {
          this.loading = false;
          this.value = this.errorText;
        });
    } else {
      // Old method (https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText)
      const reader = new FileReader();

      reader.addEventListener("loadend", e => {
        this.loading = false;
        this.value = e.target.result.toString();
      });

      reader.readAsText(answer);
    }
  }

  /**
   * Await observable and convert to human readable output
   * @param answer Answer output
   */
  private humanizeObservable(answer: Observable<ListDetailValue>) {
    this.loading = true;

    answer.subscribe(
      output => {
        this.loading = false;
        this.humanize(output.value);
        this.route = output.route;
      },
      () => {
        this.loading = false;
        this.value = this.errorText;
      }
    );
  }
}
