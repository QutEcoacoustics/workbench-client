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
        {{ links.header_title }}
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
  @Input() links: DropDownHeader;

  isInternalRoute = isInternalRoute;
  isExternalLink = isExternalLink;

  constructor() {}

  ngOnInit() {}
}

export interface DropDownHeader {
  header_title: string;
  items: NavigableMenuItem[];
}
