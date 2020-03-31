import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DateTime, Duration } from "luxon";

@Component({
  selector: "app-question-answer",
  template: `
    <div>
      <div *ngFor="let detail of details">
        <div class="row">
          <div class="col-sm-3 text-right">
            <p>
              <strong>
                {{ detail.label }}
              </strong>
            </p>
          </div>
          <div class="col-sm-9">
            <p *ngIf="!detail.loading; else loading">
              <a
                *ngIf="detail.route; else plainText"
                [routerLink]="[detail.route]"
              >
                {{ humanize(detail.value) }}
              </a>
              <ng-template #plainText>
                {{ humanize(detail.value) }}
              </ng-template>
            </p>
            <ng-template #loading>
              <p>loading</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionAnswerComponent {
  @Input() details: ListDetail[] = [];

  constructor() {}

  humanize(value: any) {
    if (value instanceof DateTime) {
      return value.toISO() + " (" + value.toRelative() + ")";
    }
    if (value instanceof Duration) {
      // TODO Implement humanization of duration
      return JSON.stringify(value.toObject());
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value ? value.toString() : "(no value)";
  }
}

export interface ListDetail extends ListDetailValue {
  label: string;
  loading: boolean;
}

export interface ListDetailValue {
  value: string | number | object | ListDetailValue;
  route?: string;
}
