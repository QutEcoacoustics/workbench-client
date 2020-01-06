import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Href } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

@Component({
  selector: "app-items-item",
  template: `
    <div class="clearfix" style="font-size: 0.925rem;">
      <!-- Item icon -->
      <fa-icon id="icon" [icon]="icon"></fa-icon>

      <!-- Item name -->
      <span id="name">
        <ng-container *ngIf="uri; else plainText">
          <ng-container *ngIf="isInternalRoute(); else externalLink">
            <!-- URI is internal link -->
            <a [routerLink]="uri.toString()">
              {{ name }}
            </a>
          </ng-container>
          <ng-template #externalLink>
            <!-- URI is external link -->
            <a [href]="uri">
              {{ name }}
            </a>
          </ng-template>
        </ng-container>
        <ng-template #plainText>
          <!-- No URI -->
          {{ name }}
        </ng-template>
      </span>

      <!-- Item value -->
      <span id="value" class="badge badge-pill badge-secondary float-right">
        {{ value }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() icon: IconProp;
  @Input() name: string;
  @Input() value: string | number;
  @Input() uri?: Href | StrongRoute;

  constructor() {}

  isInternalRoute() {
    return typeof this.uri === "object";
  }
}

export interface ItemInterface {
  icon: IconProp;
  name: string;
  value: string | number;
  uri?: Href | StrongRoute;
}
