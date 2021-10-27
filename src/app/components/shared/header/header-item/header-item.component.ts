import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  getRoute,
  isExternalLink,
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
      <ng-content></ng-content>
      <ng-container *ngIf="!hasContent">{{ link.label }}</ng-container>
    </ng-template>

    <ng-template #internalRoute>
      <a
        #navLink
        class="nav-link"
        strongRouteActive="active"
        [id]="label + '-header-link'"
        [strongRoute]="strongRoute"
      >
        <ng-container *ngTemplateOutlet="linkContents"></ng-container>
      </a>
    </ng-template>

    <ng-template #externalLink>
      <a #navLink class="nav-link" [id]="label + '-header-link'" [href]="href">
        <ng-container *ngTemplateOutlet="linkContents"></ng-container>
      </a>
    </ng-template>

    <li class="nav-item">
      <ng-container
        *ngIf="isInternalRoute(link); else externalLink"
        [ngTemplateOutlet]="internalRoute"
      ></ng-container>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderItemComponent implements OnInit {
  @ViewChild("navLink", { read: ElementRef, static: true })
  private navLink: ElementRef<HTMLElement>;
  @Input() public link: NavigableMenuItem;

  public isInternalRoute = isInternalRoute;
  public hasContent: boolean;
  public label: string;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    // Only nav links which contain content will initially have a child element
    this.hasContent = this.navLink?.nativeElement?.childElementCount === 1;
    this.label = camelCase(this.link.label);
  }

  public get strongRoute(): StrongRoute {
    return (this.link as MenuRoute)?.route;
  }

  public get href(): string {
    return isExternalLink(this.link)
      ? getRoute(this.link, this.route.snapshot.params)
      : undefined;
  }
}
