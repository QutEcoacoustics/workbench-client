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
  menuItem,
  MenuItem,
} from "@interfaces/menusInterfaces";
import { SessionUser } from "@models/User";
import { NgbModal, Placement } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { List } from "immutable";
import { ModalComponent, WidgetComponent } from "./widget/widget.component";
import { WidgetDirective } from "./widget/widget.directive";
import { WidgetMenuItem } from "./widget/widgetItem";

interface ModalWidget {
  link: MenuItem;
  widget: WidgetMenuItem;
}

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
  @Input() public links: List<AnyMenuItem>;
  @Input() public menuType: "action" | "secondary";
  @Input() public widget?: WidgetMenuItem;
  @Input() public modals?: ModalWidget[] = [
    {
      link: menuItem({
        icon: ["fas", "vial"],
        label: "Test Modal",
        tooltip: () => "Experimental modal testing",
      }),
      widget: new WidgetMenuItem(AnnotationDownloadComponent, {}),
    },
  ];
  @ViewChild(WidgetDirective, { read: ViewContainerRef })
  private menuWidget: ViewContainerRef;

  public filteredLinks: Set<AnyMenuItem>;
  public placement: Placement;
  public params: Params;
  public user: SessionUser;
  public loadedModal: ModalWidget;

  public isInternalLink = isInternalRoute;
  public isExternalLink = isExternalLink;
  public isAction = isButton;

  public constructor(
    private api: SecurityService,
    private route: ActivatedRoute,
    private factoryResolver: ComponentFactoryResolver,
    private modalService: NgbModal
  ) {
    super();
  }

  public ngOnInit(): void {
    // Get user details
    this.user = this.api.getLocalUser();
    this.placement = this.menuType === "action" ? "left" : "right";
    const snapshot = this.route.snapshot;
    const pageData = snapshot.data;

    // Filter links
    this.filteredLinks = new Set(
      this.links
        ?.filter((link) => {
          if (!link.predicate || link.active) {
            // Clear any modifications to link by secondary menu
            link.active = false;
            return true;
          }

          // If link has predicate function, test if returns true
          return link.predicate(this.user, pageData);
        })
        ?.sort(this.compare)
    );

    // Retrieve router parameters to override link attributes
    this.params = snapshot.params;
  }

  public ngAfterViewInit(): void {
    // Load widgets
    if (this.widget) {
      this.insertComponent(this.widget, this.menuWidget);
    }
  }

  /**
   * Determine whether to show links
   */
  public hasLinks(): boolean {
    return this.filteredLinks.size > 0 || this.modals.length > 0;
  }

  /**
   * Calculate the indentation of a secondary link item
   *
   * @param link Link to calculate padding for
   */
  public calculateIndentation(link: AnyMenuItem): number {
    // Only the secondary menu implements this option
    if (this.menuType !== "secondary" || !link.indentation) {
      return 0;
    }

    return link.indentation;
  }

  public modalAction(link: MenuItem, index: number): MenuAction {
    return menuAction({
      ...link,
      action: () => {
        const widget = this.modals[index].widget;
        const modalRef = this.modalService.open(widget.component, {
          size: widget.pageData.size ?? "lg",
          centered: widget.pageData.centered ?? true,
          scrollable: widget.pageData.scrollable ?? true,
        });
        const component: ModalComponent = modalRef.componentInstance;
        Object.assign(component, {
          pageData: widget.pageData,
          routeData: this.route.snapshot.data as PageInfo,
          dismissModal: (reason: any) => modalRef.dismiss(reason),
          closeModal: (result: any) => modalRef.close(result),
        } as ModalComponent);
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
