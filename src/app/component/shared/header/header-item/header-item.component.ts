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
  selector: "app-header-item",
  template: `
    <li class="nav-item" *ngIf="link">
      <ng-container *ngIf="isInternalRoute(link)">
        <a
          class="nav-link"
          routerLinkActive="active"
          [routerLink]="link.route.toString()"
        >
          {{ link.label }}
        </a>
      </ng-container>
      <ng-container *ngIf="isExternalLink(link)">
        <a class="nav-link" [href]="link.uri">
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

  constructor() {}

  ngOnInit() {}
}
