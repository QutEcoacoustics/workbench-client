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
import camelCase from "just-camel-case";

/**
 * Header Item Component.
 * Displays a header link.
 */
@Component({
  selector: "baw-header-item",
  template: `
    <ng-template #linkContents>
      <ng-container>{{ link.label }}</ng-container>
    </ng-template>

    <ng-template #internalRoute>
      <a
        class="nav-link"
        strongRouteActive="active"
        [id]="label + '-header-link'"
        [strongRoute]="strongRoute"
      >
        <ng-container *ngTemplateOutlet="linkContents"></ng-container>
      </a>
    </ng-template>

    <ng-template #externalLink>
      <a class="nav-link" [id]="label + '-header-link'" [href]="href">
        <ng-container *ngTemplateOutlet="linkContents"></ng-container>
      </a>
    </ng-template>

    <li class="nav-item">
      <ng-container
        *ngIf="hasStrongRoute; else externalLink"
        [ngTemplateOutlet]="internalRoute"
      ></ng-container>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderItemComponent implements OnInit {
  @Input() public link: NavigableMenuItem;

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
    return getRoute(this.link, this.route.snapshot.params);
  }
}
