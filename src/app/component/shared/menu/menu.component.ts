import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { List } from "immutable";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import {
  AnyMenuItem,
  isButton,
  isExternalLink,
  isInternalRoute,
  LabelAndIcon
} from "src/app/interfaces/menusInterfaces";
import { SessionUser } from "src/app/models/User";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { WidgetComponent } from "../widget/widget.component";
import { WidgetDirective } from "../widget/widget.directive";
import { WidgetMenuItem } from "../widget/widgetItem";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends WithUnsubscribe() implements OnInit {
  @Input() title?: LabelAndIcon;
  @Input() links: List<AnyMenuItem>;
  @Input() menuType: "action" | "secondary";
  @Input() widget?: WidgetMenuItem;
  @ViewChild(WidgetDirective, { static: true }) menuWidget: WidgetDirective;

  filteredLinks: Set<AnyMenuItem>;
  placement: "left" | "right";
  params: Params;
  url: string;
  user: SessionUser;
  loading: boolean;

  isInternalLink = isInternalRoute;
  isExternalLink = isExternalLink;
  isAction = isButton;

  constructor(
    private api: SecurityService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
  }

  ngOnInit() {
    // Get user details
    this.user = this.api.getSessionUser();
    this.placement = this.menuType === "action" ? "left" : "right";

    // Filter links
    this.filteredLinks = new Set(
      this?.links
        ?.filter(link => {
          if (!link.predicate || link.active) {
            // Clear any modifications to link by secondary menu
            link.active = false;
            return true;
          }

          // If link has predicate function, test if returns true
          return link.predicate(this?.user);
        })
        ?.sort(this.compare)
    );

    // Retrieve router parameters to override link attributes
    this.params = this.route.snapshot.params;

    // Load widget
    this.loadComponent();
  }

  /**
   * Determine whether to show links
   */
  linksExist() {
    return this.filteredLinks.size > 0 && !this.loading;
  }

  /**
   * Calculate the indentation of a secondary link item
   * @param link Link to calculate padding for
   */
  calculateIndentation(link: AnyMenuItem) {
    // Only the secondary menu implements this option
    if (this.menuType !== "secondary" || !link.indentation) {
      return 0;
    }

    return link.indentation;
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
    (componentRef.instance as WidgetComponent).pageData = this.widget.pageData;
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

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (a.order === b.order) {
      if (a.indentation === b.indentation) {
        return a?.label.localeCompare(b.label);
      }

      return a.indentation < b.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return (a?.order || Infinity) < (b?.order || Infinity) ? -1 : 1;
  }
}
