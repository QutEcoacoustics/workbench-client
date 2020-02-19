import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import {
  isExternalLink,
  isInternalRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { HeaderDropDownConvertedLink } from "src/app/services/app-config/app-config.service";

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
              routerLinkActive="active"
              [routerLink]="getRoute(link)"
            >
              {{ link.label }}
            </a>
          </ng-container>
          <ng-container *ngIf="isExternalLink(link)">
            <a ngbDropdownItem [href]="getRoute(link)">
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
  @Input() links: HeaderDropDownConvertedLink;

  isInternalRoute = isInternalRoute;
  isExternalLink = isExternalLink;

  constructor() {}

  ngOnInit() {}

  /**
   * Get link route. This is only required because typescript is unable to
   * properly type-check links in template
   */
  public getRoute(link: NavigableMenuItem): string {
    if (isInternalRoute(link)) {
      return link.route.toString();
    } else {
      return link.uri(undefined);
    }
  }
}
