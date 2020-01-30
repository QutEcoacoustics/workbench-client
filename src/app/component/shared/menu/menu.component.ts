import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  AnyMenuItem,
  isButton,
  isExternalLink,
  isInternalRoute,
  LabelAndIcon
} from "src/app/interfaces/menusInterfaces";
import { SessionUser } from "src/app/models/User";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
import { WidgetComponent } from "../widget/widget.component";
import { WidgetDirective } from "../widget/widget.directive";
import { WidgetMenuItem } from "../widget/widgetItem";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit, OnDestroy {
  @Input() title?: LabelAndIcon;
  @Input() links: List<AnyMenuItem>;
  @Input() menuType: "action" | "secondary";
  @Input() widget?: WidgetMenuItem;
  @ViewChild(WidgetDirective, { static: true }) menuWidget: WidgetDirective;

  private unsubscribe = new Subject();
  filteredLinks: Set<AnyMenuItem>;
  placement: "left" | "right";
  routerParams: Params;
  url: string;
  user: SessionUser;
  loading: boolean;

  isInternalLink = isInternalRoute;
  isExternalLink = isExternalLink;
  isAction = isButton;

  constructor(
    private api: BawApiService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.loading = true;

    // Get user details
    this.user = this.api.getSessionUser();
    this.placement = this.menuType === "action" ? "left" : "right";

    // Filter links
    this.filteredLinks = new Set(this
      ?.links
      ?.filter((link) => {
          // If link has predicate function, test if returns true
          return link.predicate ? link.predicate(this?.user) : true;
      })
      ?.sort(this.compare));

    // Retrieve router parameters to override link attributes
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(
      params => {
        this.routerParams = params;
        this.loading = false;
      },
      err => {
        console.error("MenuComponent: ", err);
      }
    );

    // Load widget
    this.loadComponent();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Determine whether to show links
   */
  linksExist() {
    return this.filteredLinks.size > 0 && !this.loading;
  }

  /**
   * Load widget component
   */
  loadComponent() {
    if (!this.widget) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.widget.component
    );

    const viewContainerRef = this.menuWidget.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as WidgetComponent).data = this.widget.data;
  }

  /**
   * Sort function for list of menu items
   * @param a First menu item
   * @param b Second menu item
   */
  private compare(a: AnyMenuItem, b: AnyMenuItem): number {
    // If no order, return equal - i.e. a stable sort!
    if (!a.order && !b.order) {
      return 0;
    }

    // If only a has order, return a is less than b
    if (a.order && !b.order) {
      return -1;
    }

    // If only b has order, return b is greater than a
    if (b.order && !a.order) {
      return 1;
    }

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (a.order === b.order) {
      if (a.indentation === b.indentation) {
        return a?.label.localeCompare(b.label);
      }

      return a.indentation < b.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return a.order < b.order ? -1 : 1;
  }
}
