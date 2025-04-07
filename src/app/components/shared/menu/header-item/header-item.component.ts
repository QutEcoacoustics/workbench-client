import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  getRoute,
  isInternalRoute,
  MenuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { HeaderItem } from "@menu/primary-menu/primary-menu.component";
import camelCase from "just-camel-case";

/**
 * Header Item Component.
 * Displays a header link.
 */
@Component({
  selector: "baw-header-item",
  template: `
    <!-- Internal link template -->
    <ng-template #internalRoute>
      <a
        class="nav-link"
        strongRouteActive="active"
        [id]="label + '-header-link'"
        [strongRoute]="strongRoute"
      >
        {{ link.label }}
      </a>
    </ng-template>

    <!-- External link template -->
    <ng-template #externalLink>
      <a class="nav-link" [id]="label + '-header-link'" [href]="href">
        {{ link.label }}
      </a>
    </ng-template>

    <!-- Create LI with either internal or external link template -->
    <li class="nav-item">
      <ng-container
        *ngIf="hasStrongRoute; else externalLink"
        [ngTemplateOutlet]="internalRoute"
      ></ng-container>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HeaderItemComponent implements OnInit {
  @Input() public link: NavigableMenuItem | HeaderItem;

  public hasStrongRoute: boolean;
  public label: string;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.label = camelCase(this.link.label);
    this.hasStrongRoute = isInternalRoute(this.link);
  }

  public get strongRoute(): StrongRoute {
    return (this.link as MenuRoute).route;
  }

  public get href(): string {
    return getRoute(this.link as NavigableMenuItem, this.route.snapshot.params);
  }
}
