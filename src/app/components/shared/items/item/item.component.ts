import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgClass } from "@angular/common";

/**
 * Item Component
 */
@Component({
    selector: "baw-items-item",
    template: `
    <div class="clearfix" style="font-size: 0.925rem;">
      <!-- Item icon -->
      <fa-icon
        id="icon"
        class="me-2"
        [icon]="icon()"
        [ngbTooltip]="tooltipText"
      ></fa-icon>

      <!-- Item name -->
      <span id="name">{{ name() }}</span>

      <!-- Item value -->
      <span
        id="value"
        class="badge rounded text-bg-secondary float-end"
        [ngClass]="color() && 'bg-' + color()"
      >
        {{ value() ?? "Unknown" }}
      </span>
    </div>
  `,
    // Pure Component
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, NgbTooltip, NgClass]
})
export class ItemComponent {
  public readonly icon = input<IconProp>(undefined);
  public readonly name = input<string>(undefined);
  public readonly tooltip = input<() => string>(undefined);
  public readonly value = input<string | number>(undefined);
  public readonly color = input<string>(undefined);

  public get tooltipText(): string {
    return this.tooltip()?.() ?? undefined;
  }
}

export interface IItem {
  icon: IconProp;
  name: string;
  tooltip?: () => string;
  value?: string | number;
  color?: string;
}
