import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  input
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { MenuType } from "@helpers/generalTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  AnyMenuItem,
  isButton,
  isExternalLink,
  isInternalRoute,
  LabelAndIcon,
} from "@interfaces/menusInterfaces";
import { User } from "@models/User";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuService } from "@services/menu/menu.service";
import { Set } from "immutable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { UpperCasePipe } from "@angular/common";
import { ModalComponent } from "../widgets/widget.component";
import { WidgetDirective } from "../widgets/widget.directive";
import {
  isMenuModal,
  menuModal,
  MenuModal,
  MenuModalWithoutAction,
  WidgetMenuItem,
} from "../widgets/widgetItem";
import { MenuButtonComponent } from "../button/button.component";
import { MenuLinkComponent } from "../link/link.component";

/**
 * Menu Component.
 * Used to display menu links, routes, and actions.
 */
@Component({
  selector: "baw-menu",
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.scss",
  imports: [
    FaIconComponent,
    MenuButtonComponent,
    MenuLinkComponent,
    WidgetDirective,
    UpperCasePipe,
  ],
})
export class MenuComponent implements OnChanges, AfterViewInit {
  public readonly isSideNav = input<boolean>(undefined);
  @Input() public title?: LabelAndIcon;
  public readonly links = input.required<Set<AnyMenuItem | MenuModalWithoutAction>>();
  public readonly menuType = input.required<MenuType>();
  public readonly widgets = input<Set<WidgetMenuItem>>(Set());
  @ViewChild(WidgetDirective, { read: ViewContainerRef })
  private menuWidget!: ViewContainerRef;

  public formattedLinks: Set<AnyMenuItem | MenuModal> = Set();
  public user: User;

  public isInternalLink = isInternalRoute;
  public isExternalLink = isExternalLink;
  public isAction = isButton;
  public isModal = isMenuModal;

  public constructor(
    public menuService: MenuService,
    private session: BawSessionService,
    private modalService: NgbModal
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    // Get user details
    this.user = this.session.loggedInUser;
    // Filter links
    this.formattedLinks = this.setModalActions();

    if (changes.widgets?.previousValue !== changes.widgets?.currentValue) {
      this.clearWidgets();
      this.insertWidgets();
    }
  }

  public ngAfterViewInit(): void {
    this.insertWidgets();
  }

  /** Determine whether to show widgets */
  public hasWidgets(): boolean {
    const widgets = this.widgets();
    return isInstantiated(widgets) && widgets.count() > 0;
  }

  /** Determine whether to show links */
  public hasLinks(): boolean {
    return this.formattedLinks.size > 0;
  }

  /** Is the a secondary menu */
  public isSecondaryMenu(): boolean {
    return this.menuType() === "secondary";
  }

  /**
   * Calculate the indentation of a secondary link item
   *
   * @param link Link to calculate padding for
   */
  public calculateIndentation(link: AnyMenuItem | MenuModal): number {
    // Only the secondary menu implements this option
    return this.isSecondaryMenu() && link.indentation ? link.indentation : 0;
  }

  /** Update modal menu items to include an action which will open/close the modal */
  private setModalActions(): Set<AnyMenuItem | MenuModal> {
    return (
      // Change modal menu item links into menu actions
      this.links().map((link) =>
        isMenuModal(link) ? this.createModalAction(link) : link
      )
    );
  }

  /**
   * Generates a menuAction for the modal menu item which allows it to
   * create a modal on click
   *
   * @param modal Modal menu item
   * @returns Menu Action
   */
  private createModalAction(modal: MenuModalWithoutAction): MenuModal {
    const action = (): void => {
      const modalRef = this.modalService.open(modal.component, modal.modalOpts);
      const component: ModalComponent = modalRef.componentInstance;
      modal.assignComponentData(component, modalRef);
    };

    // modal success callbacks should be called with the current page instance
    // the page instance is set from the menu service because the menu item should not have any knowledge of the current route
    if (modal.successCallback) {
      modal.successCallback = this.menuService.constructSuccessCallback(modal.successCallback);
    }

    return menuModal({ ...modal, action }) as MenuModal;
  }

  /** Clear widgets */
  private clearWidgets(): void {
    this.menuWidget?.clear();
  }

  /** Insert widgets into menu */
  private insertWidgets(): void {
    if (!this.menuWidget) {
      return;
    }
    this.widgets()?.forEach((widget) => this.insertWidget(widget));
  }

  /**
   * Insert widget into menu
   *
   * @param widget Widget Component
   */
  private insertWidget(widget: WidgetMenuItem): void {
    const temp = this.menuWidget.createComponent(widget.component);

    Object.keys(widget.options ?? {}).forEach((key) => {
      temp.instance[key] = widget.options[key];
    });

    // This is needed, otherwise widgets sometimes throw
    // ExpressionChangedAfterItHasBeenCheckedError
    temp.changeDetectorRef.detectChanges();
  }
}
