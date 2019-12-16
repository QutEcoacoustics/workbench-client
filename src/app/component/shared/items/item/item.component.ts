import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: "app-items-item",
  template: `
    <li class="list-group-item clearfix">
      <fa-icon id="icon" [icon]="icon"></fa-icon>
      <span id="name">
        {{ name }}
      </span>
      <span id="value" class="badge badge-pill badge-secondary float-right">
        {{ value }}
      </span>
    </li>
  `,
  styles: [
    `
      li {
        font-size: 0.925rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsItemComponent {
  @Input() icon: IconProp;
  @Input() name: string;
  @Input() value: string | number;

  constructor() {}
}
