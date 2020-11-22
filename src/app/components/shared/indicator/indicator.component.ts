import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "baw-indicator",
  template: `
    <div [ngSwitch]="status">
      <!-- Success Status -->
      <div *ngSwitchCase="Status.Success" class="mx-auto" style="width: 14px;">
        <fa-icon style="color: limegreen;" [icon]="['fas', 'check']"></fa-icon>
      </div>

      <!-- Error Status -->
      <div *ngSwitchCase="Status.Error" class="mx-auto" style="width: 10px;">
        <fa-icon style="color: red;" [icon]="['fas', 'times']"></fa-icon>
      </div>

      <!-- Warning/Default Status -->
      <div *ngSwitchDefault class="mx-auto" style="width: 19px;">
        <fa-icon
          style="color: orange;"
          [icon]="['fas', 'exclamation-triangle']"
        ></fa-icon>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorComponent {
  @Input() public status: Status = Status.success;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public Status = Status;
}

export enum Status {
  success,
  warning,
  error,
}
