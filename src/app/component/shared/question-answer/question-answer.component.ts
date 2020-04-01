import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { Observable } from "rxjs";

@Component({
  selector: "app-question-answer",
  template: `
    <div>
      <div *ngFor="let detail of details">
        <div class="row">
          <div class="col-sm-3">
            <p class="text-left text-sm-right">
              <strong>
                {{ detail.label }}
              </strong>
            </p>
          </div>
          <div class="col-sm-9">
            <app-answer [detail]="detail"></app-answer>
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
}

export interface ListDetail extends ListDetailValue {
  label: string;
}

export interface ListDetailValue {
  value:
    | string
    | number
    | object
    | Blob
    | DateTime
    | Duration
    | ListDetailValue[]
    | Observable<ListDetailValue>;
  route?: string;
}
