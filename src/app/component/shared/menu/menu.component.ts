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
export class MenuComponent implements OnInit {
  @Input() title?: LabelAndIcon;
  @Input() links: List<AnyMenuItem>;
  @Input() widget: WidgetMenuItem;
  @Input() menuType: "action" | "secondary";
  @ViewChild(WidgetDirective, { static: true }) menuWidget: WidgetDirective;

  filteredLinks: Set<AnyMenuItem>;
  placement: "left" | "right";
  routerParams: Params;
  url: string;

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
    const user: SessionUser = this.api.getUser();
    this.placement = this.menuType === "action" ? "left" : "right";

    this.filteredLinks = this.removeDuplicates(
      this.links
        ? this.links.filter(link => this.filter(user, link))
        : List<AnyMenuItem>([])
    );

    this.route.params.subscribe({
      next: params => {
        this.routerParams = params;
      }
    });

    this.loadComponent();
  }

  /**
   * Calculate the left padding of a secondary link item
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
   * @param user User details
   * @param link Link to display
   * @returns True if filter is passed
   */
  private filter(user: SessionUser, link: AnyMenuItem) {
    // If link has predicate function, test if returns true
    if (link.predicate) {
      return link.predicate(user);
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
}
