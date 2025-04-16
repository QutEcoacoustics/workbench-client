import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "baw-indicator",
  template: `
    <div>
      @switch (status) {
        <!-- Success Status -->
        @case (state.success) {
          <div class="mx-auto" style="width: 14px;">
            <fa-icon style="color: limegreen;" [icon]="['fas', 'check']"></fa-icon>
          </div>
        }
        <!-- Error Status -->
        @case (state.error) {
          <div class="mx-auto" style="width: 10px;">
            <fa-icon style="color: red;" [icon]="['fas', 'times']"></fa-icon>
          </div>
        }
        <!-- Warning/Default Status -->
        @default {
          <div class="mx-auto" style="width: 19px;">
            <fa-icon
              style="color: orange;"
              [icon]="['fas', 'exclamation-triangle']"
            ></fa-icon>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent]
})
export class IndicatorComponent {
  @Input() public status: Status = Status.success;
  public state = Status;
}

export enum Status {
  success,
  warning,
  error,
}
