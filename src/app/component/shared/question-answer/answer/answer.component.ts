import { Component, Input, OnInit } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { isUninitialized } from "src/app/helpers";
import { humanizeDuration } from "src/app/interfaces/apiInterfaces";
import { ListDetail, ListDetailValue } from "../question-answer.component";

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
        <p>loading</p>
      </ng-template>
    </ng-container>
    <ng-template #hasChildren>
      <app-answer *ngFor="let child of children" [detail]="child"></app-answer>
    </ng-template>
  `
})
export class AnswerComponent implements OnInit {
  @Input() detail: ListDetail;
  public codeStyling: boolean;
  public value: string;
  public route: string;
  public loading: boolean;
  public children: ListDetail[];
  private noValue = "(no value)";
  private error = "(error)";

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
      this.value = this.noValue;
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
      this.value = this.error;
    }
  }

  /**
   * Convert blob to human readable output
   * @param answer Answer output
   */
  private humanizeBlob(answer: Blob) {
    this.loading = true;
    this.codeStyling = true;
    const reader = new FileReader();

    reader.addEventListener("loadend", e => {
      this.loading = false;
      this.value = e.target.result as string;
    });

    reader.readAsText(answer);
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
        this.value = this.error;
      }
    );
  }
}
