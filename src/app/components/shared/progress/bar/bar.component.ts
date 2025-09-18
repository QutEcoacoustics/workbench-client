import { Component, input } from "@angular/core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { NgClass, NgStyle } from "@angular/common";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-progress-bar",
  template: `
    <div
      class="progress-bar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="progress()"
      [ngClass]="classes"
      [ngStyle]="{ width: progress() + '%' }"
      [ngbTooltip]="description()"
    >
      <!-- TODO Don't show progress text if text is clipping off screen -->
      {{ progress() + "%" }}
    </div>
  `,
  styles: [`
    div {
      cursor: help;
    }
  `],
  imports: [NgClass, NgStyle, NgbTooltip]
})
export class ProgressBarComponent {
  public readonly progress = input<number>(undefined);
  public readonly color = input<BootstrapColorTypes>("primary");
  public readonly textColor = input<BootstrapColorTypes>("light");
  public readonly description = input<string>(undefined);
  public readonly striped = input(true);
  // TODO Add options for all progress-bar settings

  public get classes(): string {
    const klasses = [`text-bg-${this.color()}`, `text-${this.textColor()}`];

    if (this.striped()) {
      klasses.push("progress-bar-striped", "progress-bar-animated");
    }

    return klasses.join(" ");
  }
}
