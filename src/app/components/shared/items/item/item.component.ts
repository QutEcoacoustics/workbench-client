import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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
        [icon]="icon"
        [ngbTooltip]="tooltipText"
      ></fa-icon>

      <!-- Item name -->
      <span id="name">{{ name }}</span>

      <!-- Item value -->
      <span id="value" class="badge rounded bg-secondary float-end">
        {{ value ?? "Unknown" }}
      </span>
    </div>
  `,
  // Pure Component
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() public icon: IconProp;
  @Input() public name: string;
  @Input() public tooltip: () => string;
  @Input() public value: string | number;

  public get tooltipText(): string {
    return this.tooltip?.() ?? undefined;
  }
}

export interface IItem {
  icon: IconProp;
  name: string;
  tooltip?: () => string;
  value?: string | number;
}
