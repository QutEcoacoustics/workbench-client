import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HeaderDropDownConvertedLink } from "src/app/helpers/app-initializer/app-initializer";
import {
  getRoute,
  isExternalLink,
  isInternalRoute,
} from "src/app/interfaces/menusInterfaces";

/**
 * Header Dropdown Item.
 * Displays a dropdown list of items for the user to choose from.
 */
@Component({
  selector: "baw-header-dropdown",
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
              [routerLink]="getRoute(link, params)"
            >
              {{ link.label }}
            </a>
          </ng-container>
          <ng-container *ngIf="isExternalLink(link)">
            <a ngbDropdownItem [href]="getRoute(link, params)">
              {{ link.label }}
            </a>
          </ng-container>
        </ng-container>
      </div>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDropdownComponent implements OnInit {
  @Input() active: boolean;
  @Input() links: HeaderDropDownConvertedLink;
  public params: Params;

  isInternalRoute = isInternalRoute;
  isExternalLink = isExternalLink;
  getRoute = getRoute;

  constructor(private route: ActivatedRoute) {
    this.params = this.route.snapshot.params;
  }

  ngOnInit() {}
}
