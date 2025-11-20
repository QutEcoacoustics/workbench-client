import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
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
        [innerText]="label()"
      ></button>
      <div ngbDropdownMenu aria-labelledby="dropdownBasic">
        @for (link of links(); track link) {
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
  private readonly route = inject(ActivatedRoute);

  public readonly label = input.required<string>();
  public readonly links = input.required<HeaderItem[]>();

  private readonly params: Params;

  public constructor() {
    this.params = this.route.snapshot.params;
  }

  protected getHref(link: HeaderItem): string {
    return getRoute(link as MenuLink, this.params);
  }
}
