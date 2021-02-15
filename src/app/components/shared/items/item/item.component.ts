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
      <fa-icon id="icon" [icon]="icon"></fa-icon>

      <!-- Item name -->
      <span id="name">{{ name }}</span>

      <!-- Item value -->
      <span id="value" class="badge badge-pill badge-secondary float-right">
        {{ value }}
      </span>
    </div>
  `,
  // Pure Component
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() public icon: IconProp;
  @Input() public name: string;
  @Input() public value: string | number;
}

export interface ItemInterface {
  icon: IconProp;
  name: string;
  value: string | number;
}
