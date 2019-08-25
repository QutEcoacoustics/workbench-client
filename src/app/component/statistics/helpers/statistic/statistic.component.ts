import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: "app-statistic",
  template: `
    <li class="list-group-item clearfix">
      <fa-icon [icon]="icon"></fa-icon>
      {{ name }}
      <span class="badge badge-pill badge-secondary float-right">
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
export class StatisticComponent {
  @Input() icon: IconProp;
  @Input() name: string;
  @Input() value: string | number;

  constructor() {}
}
