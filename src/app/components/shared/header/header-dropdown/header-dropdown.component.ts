import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HeaderGroupConverted } from "@helpers/app-initializer/app-initializer";
import {
  getRoute,
  isExternalLink,
  isInternalRoute,
} from "@interfaces/menusInterfaces";

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
        [innerText]="links.title"
      ></button>
      <div ngbDropdownMenu aria-labelledby="dropdownBasic">
        <ng-container *ngFor="let link of links.items">
          <!-- Internal route -->
          <a
            *ngIf="isInternalRoute(link)"
            ngbDropdownItem
            strongRouteActive="active"
            [strongRoute]="link.route"
            [innerText]="link.label"
          ></a>
          <!-- External route -->
          <a
            *ngIf="isExternalLink(link)"
            ngbDropdownItem
            [href]="getRoute(link, params)"
            [innerText]="link.label"
          ></a>
        </ng-container>
      </div>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDropdownComponent {
  @Input() public links: HeaderGroupConverted;
  public params: Params;

  public isInternalRoute = isInternalRoute;
  public isExternalLink = isExternalLink;
  public getRoute = getRoute;

  public constructor(private route: ActivatedRoute) {
    this.params = this.route.snapshot.params;
  }
}
