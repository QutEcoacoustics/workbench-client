import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { getRoute, MenuLink } from "@interfaces/menusInterfaces";
import { HeaderItem } from "@menu/primary-menu/primary-menu.component";
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem } from "@ng-bootstrap/ng-bootstrap";

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
        class="btn btn-link nav-link dropdown-toggle border-0"
        [innerText]="label"
      ></button>
      <div ngbDropdownMenu aria-labelledby="dropdownBasic">
        @for (link of links; track link) {
          <a ngbDropdownItem [href]="getHref(link)">
            {{ link.label }}
          </a>
        }
      </div>
    </li>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
})
export class HeaderDropdownComponent {
  @Input() public label: string;
  @Input() public links: HeaderItem[];
  public params: Params;

  public constructor(private route: ActivatedRoute) {
    this.params = this.route.snapshot.params;
  }

  public getHref(link: HeaderItem): string {
    return getRoute(link as MenuLink, this.params);
  }
}
