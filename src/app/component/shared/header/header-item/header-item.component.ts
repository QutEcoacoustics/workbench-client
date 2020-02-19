import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  isExternalLink,
  isInternalRoute,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-header-item",
  template: `
    <li class="nav-item" *ngIf="link">
      <ng-container *ngIf="isInternalRoute(link)">
        <a
          class="nav-link"
          routerLinkActive="active"
          [routerLink]="getRoute(link)"
        >
          {{ link.label }}
        </a>
      </ng-container>
      <ng-container *ngIf="isExternalLink(link)">
        <a class="nav-link" [href]="getRoute(link)">
          {{ link.label }}
        </a>
      </ng-container>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderItemComponent implements OnInit {
  @Input() link: NavigableMenuItem;

  isInternalRoute = isInternalRoute;
  isExternalLink = isExternalLink;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}

  /**
   * Get link route. This is only required because typescript is unable to
   * properly type-check links in template
   */
  public getRoute(link: NavigableMenuItem): string {
    if (isInternalRoute(link)) {
      return link.route.toString();
    } else {
      const params = this.route.snapshot.params;

      return link.uri(params);
    }
  }
}
