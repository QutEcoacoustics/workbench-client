import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  LabelAndIcon,
  User,
  isInternalRoute,
  isExternalLink,
  isButton,
  AnyMenuItem
} from "src/app/interfaces/layout-menus.interfaces";
import { List } from "immutable";
import { BawApiService } from "src/app/services/baw-api/baw-api.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  constructor(private api: BawApiService) {}
  @Input() title?: LabelAndIcon;
  @Input() links: List<AnyMenuItem>;
  @Input() menuType: "action" | "secondary";

  filteredLinks: Set<AnyMenuItem>;
  placement: "left" | "right";

  isInternalLink = isInternalRoute;
  isExternalLink = isExternalLink;
  isButton = isButton;
  isAction = isButton;

  ngOnInit() {
    // Get user details
    const user: User = this.api.user;
    this.placement = this.menuType === "action" ? "left" : "right";

    this.filteredLinks = this.removeDuplicates(
      this.links.filter(link => this.filter(user, link))
    );
  }

  /**
   * Calculate the left padding of a secondary link item
   */
  calculatePadding(link: AnyMenuItem) {
    // Only the secondary menu implements this option
    if (this.menuType !== "secondary") {
      return "0em";
    }

    return `${link.order.indentation}em`;
  }

  /**
   * Filters a list of links / buttons used by the action and secondary menus.
   * @param user User details
   * @param link Link to display
   * @returns True if filter is passed
   */
  private filter(user: User, link: AnyMenuItem) {
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
