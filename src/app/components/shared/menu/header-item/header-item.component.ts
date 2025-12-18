import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from "@angular/core";
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
import { NgTemplateOutlet } from "@angular/common";
import { StrongRouteActiveDirective } from "@directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";

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

    <!-- Create LI with either internal or external link template -->
    <li class="nav-item">
      @if (hasStrongRoute) {
        <ng-container
          [ngTemplateOutlet]="internalRoute"
        ></ng-container>
      } @else {
        <a class="nav-link" [id]="label + '-header-link'" [href]="href">
          {{ link.label }}
        </a>
      }
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrongRouteActiveDirective, StrongRouteDirective, NgTemplateOutlet],
})
export class HeaderItemComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  @Input() public link: NavigableMenuItem | HeaderItem;

  public hasStrongRoute: boolean;
  public label: string;

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
