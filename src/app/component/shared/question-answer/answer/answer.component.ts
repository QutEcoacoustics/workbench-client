import { Component, Input, OnInit } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";
import { isUninitialized } from "src/app/helpers";
import { humanizeDuration } from "src/app/interfaces/apiInterfaces";
import { ListDetail, ListDetailValue } from "../question-answer.component";

@Component({
  selector: "app-answer",
  template: `
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
  `
})
export class AnswerComponent implements OnInit {
  @Input() detail: ListDetail;
  public codeStyling: boolean;
  public value: string;
  public route: string;
  public loading: boolean;
  private noValue = "(no value)";
  private error = "(error)";

  constructor() {}

  ngOnInit(): void {
    if (this.detail.route) {
      this.route = this.detail.route;
    }

    this.humanize(this.detail.value);
  }

  private humanize(answer: any) {
    if (isUninitialized(answer)) {
      this.value = this.noValue;
    } else if (answer instanceof Observable) {
      this.humanizeObservable(answer);
    } else if (answer instanceof DateTime) {
      this.value = answer.toISO() + " (" + answer.toRelative() + ")";
    } else if (answer instanceof Duration) {
      this.value = humanizeDuration(answer);
    } else if (answer instanceof Array) {
      console.log("Array Value: ", answer);
    } else if (answer instanceof Blob) {
      this.humanizeBlob(answer);
    } else if (typeof answer === "object") {
      this.humanizeObject(answer);
    } else {
      this.value = answer.toString();
    }
  }

  private humanizeObject(answer: object) {
    this.codeStyling = true;
    try {
      this.value = JSON.stringify(answer);
    } catch (err) {
      this.value = this.error;
    }
  }

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

  private humanizeObservable(answer: Observable<ListDetailValue>) {
    this.loading = true;

    answer.subscribe(
      output => {
        this.loading = false;
        this.value = output.value ? output.value.toString() : this.error;
        this.route = output.route;
      },
      () => {
        this.loading = false;
        this.value = this.error;
      }
    );
  }
}
