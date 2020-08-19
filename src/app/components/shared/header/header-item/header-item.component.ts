import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
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
      <ng-container *ngIf="isInternalRoute(link)">
        <a
          class="nav-link"
          routerLinkActive="active"
          [routerLink]="getRoute(link, params)"
        >
          {{ link.label }}
        </a>
      </ng-container>
      <ng-container *ngIf="isExternalLink(link)">
        <a class="nav-link" [href]="getRoute(link, params)">
          {{ link.label }}
        </a>
      </ng-container>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderItemComponent implements OnInit {
  @Input() public link: NavigableMenuItem;
  public params: Params;

  public isInternalRoute = isInternalRoute;
  public isExternalLink = isExternalLink;
  public getRoute = getRoute;

  constructor(private route: ActivatedRoute) {
    this.params = this.route.snapshot.params;
  }

  public ngOnInit() {}
}
