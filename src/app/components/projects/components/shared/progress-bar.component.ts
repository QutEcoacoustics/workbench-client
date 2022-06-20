import { Component, Input } from "@angular/core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";

@Component({
  selector: "baw-progress-bar",
  template: `
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="progress"
      [ngClass]="'bg-' + color"
      [ngStyle]="{ width: progress + '%' }"
      [ngbTooltip]="description"
    >
      {{ progress + "%" }}
    </div>
  `,
})
export class ProgressBarComponent {
  @Input() public progress: number;
  @Input() public color: BootstrapColorTypes;
  @Input() public description: string;
}
