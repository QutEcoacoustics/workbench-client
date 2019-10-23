import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import {
  isExternalLink,
  isInternalRoute
} from "src/app/interfaces/menusInterfaces";
import { MultiLink } from "src/app/services/app-config/app-config.service";

@Component({
  selector: "app-header-dropdown",
  template: `
    <li class="nav-item dropdown" ngbDropdown>
      <button
        ngbDropdownToggle
        id="dropdownBasic"
        class="btn btn-link nav-link dropdown-toggle"
        [ngClass]="{ active: active }"
      >
        {{ links.headerTitle }}
      </button>
      <div ngbDropdownMenu aria-labelledby="dropdownBasic">
        <ng-container *ngFor="let link of links.items">
          <ng-container *ngIf="isInternalRoute(link)">
            <a
              ngbDropdownItem
              routerLink="{{ link.route.toString() }}"
              routerLinkActive="active"
            >
              {{ link.label }}
            </a>
          </ng-container>
          <ng-container *ngIf="isExternalLink(link)">
            <a ngbDropdownItem [href]="link.uri">
              {{ link.label }}
            </a>
          </ng-container>
        </ng-container>
      </div>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderDropdownComponent implements OnInit {
  @Input() active: boolean;
  @Input() links: MultiLink;

  isInternalRoute = isInternalRoute;
  isExternalLink = isExternalLink;

  constructor() {}

  ngOnInit() {}
}
