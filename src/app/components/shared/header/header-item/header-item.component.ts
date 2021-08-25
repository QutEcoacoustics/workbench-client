import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  getRoute,
  isExternalLink,
  isInternalRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";

/**
 * Header Item Component.
 * Displays a header link.
 */
@Component({
  selector: "baw-header-item",
  template: `
    <li class="nav-item" *ngIf="link">
      <a
        *ngIf="isInternalRoute(link)"
        class="nav-link"
        strongRouteActive="active"
        [strongRoute]="link.route"
      >
        {{ link.label }}
      </a>
      <a
        *ngIf="isExternalLink(link)"
        class="nav-link"
        [href]="getRoute(link, params)"
      >
        {{ link.label }}
      </a>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderItemComponent {
  @Input() public link: NavigableMenuItem;
  public params: Params;

  public isInternalRoute = isInternalRoute;
  public isExternalLink = isExternalLink;
  public getRoute = getRoute;

  public constructor(private route: ActivatedRoute) {
    this.params = this.route.snapshot.params;
  }
}
