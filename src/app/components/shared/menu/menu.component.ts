import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SecurityService } from '@baw-api/security/security.service';
import { isInstantiated } from '@helpers/isInstantiated/isInstantiated';
import { WithUnsubscribe } from '@helpers/unsubscribe/unsubscribe';
import {
  AnyMenuItem,
  isButton,
  isExternalLink,
  isInternalRoute,
  LabelAndIcon,
} from '@interfaces/menusInterfaces';
import { SessionUser } from '@models/User';
import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { List } from 'immutable';
import { WidgetComponent } from './widget/widget.component';
import { WidgetDirective } from './widget/widget.directive';
import { WidgetMenuItem } from './widget/widgetItem';

/**
 * Menu Component.
 * Used to display menu links, routes, and actions.
 */
@Component({
  selector: 'baw-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent extends WithUnsubscribe() implements OnInit {
  @Input() public title?: LabelAndIcon;
  @Input() public links: List<AnyMenuItem>;
  @Input() public menuType: 'action' | 'secondary';
  @Input() public widget?: WidgetMenuItem;
  @ViewChild(WidgetDirective, { static: true })
  public menuWidget: WidgetDirective;

  public filteredLinks: Set<AnyMenuItem>;
  public placement: Placement;
  public params: Params;
  public user: SessionUser;

  public isInternalLink = isInternalRoute;
  public isExternalLink = isExternalLink;
  public isAction = isButton;

  constructor(
    private api: SecurityService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
  }

  public ngOnInit() {
    // Get user details
    this.user = this.api.getLocalUser();
    this.placement = this.menuType === 'action' ? 'left' : 'right';
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

    // Load widget
    this.loadComponent();
  }

  /**
   * Determine whether to show links
   */
  public linksExist() {
    return this.filteredLinks.size > 0;
  }

  /**
   * Calculate the indentation of a secondary link item
   *
   * @param link Link to calculate padding for
   */
  public calculateIndentation(link: AnyMenuItem) {
    // Only the secondary menu implements this option
    if (this.menuType !== 'secondary' || !link.indentation) {
      return 0;
    }

    return link.indentation;
  }

  /**
   * Load widget component
   */
  public loadComponent() {
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
