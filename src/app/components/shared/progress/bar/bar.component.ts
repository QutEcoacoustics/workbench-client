import { Component, Input } from "@angular/core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";

@Component({
  selector: "baw-progress-bar",
  template: `
    <div
      class="progress-bar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="progress"
      [ngClass]="classes"
      [ngStyle]="{ width: progress + '%' }"
      [ngbTooltip]="description"
    >
      {{ progress + "%" }}
    </div>
  `,
  styles: [
    `
      div {
        cursor: help;
      }
    `,
  ],
})
export class ProgressBarComponent {
  @Input() public progress: number;
  @Input() public color: BootstrapColorTypes = "primary";
  @Input() public textColor: BootstrapColorTypes = "light";
  @Input() public description: string;
  @Input() public striped = true;
  // TODO Add options for all progress-bar settings

  public get classes(): string {
    const klasses = [`bg-${this.color}`, `text-${this.textColor}`];

    if (this.striped) {
      klasses.push("progress-bar-striped", "progress-bar-animated");
    }

    return klasses.join(" ");
  }
}
