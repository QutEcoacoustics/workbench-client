import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { SecurityService } from "@baw-api/security/security.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  AnyMenuItem,
  isButton,
  isExternalLink,
  isInternalRoute,
  LabelAndIcon,
  menuAction,
  MenuAction,
} from "@interfaces/menusInterfaces";
import { SessionUser } from "@models/User";
import { NgbModal, Placement } from "@ng-bootstrap/ng-bootstrap";
import { List, Set } from "immutable";
import { ModalComponent, WidgetComponent } from "./widget/widget.component";
import { WidgetDirective } from "./widget/widget.directive";
import {
  isModalMenuItem,
  ModalMenuItem,
  WidgetMenuItem,
} from "./widget/widgetItem";

/**
 * Menu Component.
 * Used to display menu links, routes, and actions.
 */
@Component({
  selector: "baw-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent
  extends withUnsubscribe()
  implements OnInit, AfterViewInit
{
  @Input() public title?: LabelAndIcon;
  @Input() public links!: List<AnyMenuItem | ModalMenuItem>;
  @Input() public menuType!: "action" | "secondary";
  @Input() public widgets?: WidgetMenuItem[];
  @ViewChild(WidgetDirective, { read: ViewContainerRef })
  private menuWidget!: ViewContainerRef;

  public filteredLinks: Set<AnyMenuItem | ModalMenuItem> = Set();
  public placement: Placement;
  public params: Params;
  public user: SessionUser;
  public loadedModal: ModalMenuItem;

  public isInternalLink = isInternalRoute;
  public isExternalLink = isExternalLink;
  public isAction = isButton;
  public isModal = isModalMenuItem;

  public constructor(
    private api: SecurityService,
    private route: ActivatedRoute,
    private factoryResolver: ComponentFactoryResolver,
    private modalService: NgbModal
  ) {
    super();
  }

  private getMenuItem(menuItem: AnyMenuItem | ModalMenuItem): AnyMenuItem {
    return isModalMenuItem(menuItem) ? menuItem.link : menuItem;
  }

  public ngOnInit(): void {
    // Get user details
    this.user = this.api.getLocalUser();
    this.placement = this.menuType === "action" ? "left" : "right";
    const snapshot = this.route.snapshot;
    const pageData = snapshot.data;

    // Filter links
    this.filteredLinks = this.links
      ?.filter((_link) => {
        const link = this.getMenuItem(_link);
        if (!link.predicate || link.active) {
          // Clear any modifications to link by secondary menu
          link.active = false;
          return true;
        }

        // If link has predicate function, test if returns true
        return link.predicate(this.user, pageData);
      })
      ?.sort((a, b) => this.compare(this.getMenuItem(a), this.getMenuItem(b)))
      ?.toSet()
      /*
       * Change modal menu item links into menu actions. We do this after
       * converting to a set so that if the same modal widget is appended
       * multiple times, it will be filtered out
       */
      ?.map((link) => {
        if (isModalMenuItem(link)) {
          return new ModalMenuItem(
            this.modalAction(link),
            link.component,
            link.pageData,
            link.modalOpts
          );
        }
        return link;
      });

    // Retrieve router parameters to override link attributes
    this.params = snapshot.params;
  }

  public ngAfterViewInit(): void {
    // Load widgets
    this.widgets?.forEach((widget) =>
      this.insertComponent(widget, this.menuWidget)
    );
  }

  /**
   * Determine whether to show links
   */
  public hasLinks(): boolean {
    return this.filteredLinks.size > 0;
  }

  /**
   * Calculate the indentation of a secondary link item
   *
   * @param _link Link to calculate padding for
   */
  public calculateIndentation(_link: AnyMenuItem | ModalMenuItem): number {
    const link = this.getMenuItem(_link);
    // Only the secondary menu implements this option
    return this.menuType === "secondary" && link.indentation
      ? link.indentation
      : 0;
  }

  /**
   * Generates a menuAction for the modal menu item which allows it to
   * create a modal on click
   *
   * @param modal Modal menu item
   * @returns Menu Action
   */
  private modalAction(modal: ModalMenuItem): MenuAction {
    return menuAction({
      ...modal.link,
      action: () => {
        const modalRef = this.modalService.open(
          modal.component,
          modal.modalOpts
        );
        const component: ModalComponent = modalRef.componentInstance;
        modal.assignComponentData(
          component,
          this.route.snapshot.data as PageInfo,
          modalRef
        );
      },
    });
  }

  /**
   * Insert component into menu
   *
   * @param component Widget Component
   * @param containerRef Container reference to ng-template
   */
  private insertComponent(
    component: WidgetMenuItem,
    containerRef: ViewContainerRef
  ): void {
    const factory = this.factoryResolver.resolveComponentFactory(
      component.component
    );
    const componentRef = containerRef.createComponent<WidgetComponent>(factory);
    componentRef.instance.pageData = component.pageData;
  }

  /**
   * Sort function for list of menu items
   *
   * @param a First menu item
   * @param b Second menu item
   */
  private compare(a: AnyMenuItem, b: AnyMenuItem): number {
    // If no order, return equal - i.e. a stable sort!
    if (!isInstantiated(a.order) && !isInstantiated(b.order)) {
      return 0;
    }

    // If both have the same order number,
    // prioritize based on indentation and alphabetical order
    if (a.order === b.order) {
      if (a.indentation === b.indentation) {
        return a.label.localeCompare(b.label);
      }

      return a.indentation < b.indentation ? -1 : 1;
    }

    // Return the menu item with the lower order value
    return (a.order ?? Infinity) < (b.order ?? Infinity) ? -1 : 1;
  }
}
