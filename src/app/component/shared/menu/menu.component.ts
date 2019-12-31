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

  isInternalLink = isInternalRoute;
  isExternalLink = isExternalLink;
  isAction = isButton;

  constructor(
    private api: BawApiService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    // Get user details
    this.user = this.api.getSessionUser();
    this.placement = this.menuType === "action" ? "left" : "right";

    // Filter links
    this.filteredLinks = this.removeDuplicates(
      this.links
        ? this.menuType === "secondary"
          ? this.links.filter(link => this.filter(link)).sort(this.compare)
          : this.links.filter(link => this.filter(link))
        : List<AnyMenuItem>([])
    );

    // Retrieve router parameters to override link attributes
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(
      params => {
        this.routerParams = params;
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
    return this.filteredLinks.size > 0;
  }

  /**
   * Calculate the left padding of a secondary link item
   * @param link Link to calculate padding for
   */
  calculatePadding(link: AnyMenuItem) {
    // Only the secondary menu implements this option
    if (
      this.menuType !== "secondary" ||
      !link.order ||
      !link.order.indentation
    ) {
      return "0em";
    }

    return `${link.order.indentation}em`;
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
   * Filters a list of links / buttons used by the action and secondary menus.
   * @param link Link to display
   * @returns True if filter is passed
   */
  private filter(link: AnyMenuItem) {
    // If link has predicate function, test if returns true
    if (link.predicate) {
      return link.predicate(this.user);
    }
    return true;
  }

  /**
   * Remove duplicate links
   * @param list List of links
   * @returns Set of non-duplicate links
   */
  private removeDuplicates(list: List<AnyMenuItem>): Set<AnyMenuItem> {
    const set: Set<AnyMenuItem> = new Set([]);

    // List through each link and check if it matches the label of a link in the set
    list.forEach(link => {
      let match = false;
      set.forEach(setLink => {
        if (setLink.label === link.label) {
          match = true;
          return;
        }
      });

      if (!match) {
        set.add(link);
      }
    });

    return set;
  }

  /**
   * Sort function for list of menu items
   * @param a First menu item
   * @param b Second menu item
   */
  private compare(a: AnyMenuItem, b: AnyMenuItem): number {
    // If no order, return alphabetical order
    if (!a.order && !b.order) {
      return a.label < b.label ? -1 : 1;
    }

    // If only a has order, return a
    if (a.order && !b.order) {
      return -1;
    }

    // If only b has order, return b
    if (b.order && !a.order) {
      return 1;
    }

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (a.order.priority === b.order.priority) {
      if (a.order.indentation === b.order.indentation) {
        return a.label < b.label ? -1 : 1;
      }

      return a.order.indentation < b.order.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return a.order.priority < b.order.priority ? -1 : 1;
  }
}
