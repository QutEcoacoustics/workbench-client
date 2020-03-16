import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Href } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

/**
 * Item Component
 */
@Component({
  selector: "app-items-item",
  template: `
    <div class="clearfix" style="font-size: 0.925rem;">
      <!-- Item icon -->
      <fa-icon id="icon" [icon]="icon"></fa-icon>

      <!-- Item name -->
      <span id="name">
        <ng-container *ngIf="uri; else plainText">
          <ng-container *ngIf="internalLink; else externalLink">
            <!-- URI is internal link -->
            <a [routerLink]="link">
              {{ name }}
            </a>
          </ng-container>
          <ng-template #externalLink>
            <!-- URI is external link -->
            <a [href]="link">
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
export class ItemComponent implements OnInit {
  @Input() icon: IconProp;
  @Input() name: string;
  @Input() value: string | number;
  @Input() uri?: Href | StrongRoute;
  link: string;
  internalLink: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.uri) {
      return;
    }

    if (typeof this.uri === "object") {
      this.internalLink = true;
      this.link = this.uri.toString();
    } else {
      const params = this.route.snapshot.params;

      this.internalLink = false;
      this.link = this.uri(params);
    }
  }
}

export interface ItemInterface {
  icon: IconProp;
  name: string;
  value: string | number;
  uri?: Href | StrongRoute;
}
