import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  LabelAndIcon,
  MenuLink,
  MenuAction,
  Location,
  User
} from "src/app/interfaces/layout-menus.interfaces";
import { List } from "immutable";
import { Route } from "@angular/router";
import { BawApiService } from "src/app/services/baw-api/baw-api.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  @Input() title?: LabelAndIcon;
  @Input() links: List<MenuAction | MenuLink>;
  @Input() menuType: "action" | "secondary";

  filteredLinks: List<MenuAction | MenuLink>;

  constructor(private api: BawApiService) {}

  ngOnInit() {
    // Get user details
    const user: User = this.api.username;
    this.filteredLinks = this.links.filter(link => this.filter(user, link));
  }

  isInternalLink(uri: Location): uri is Route {
    return !uri.toString().includes("http");
  }

  isAction(link: MenuAction | MenuLink): link is MenuAction {
    return typeof (link as MenuAction).action === "function";
  }

  /**
   * Filters a list of links / buttons used by the action and secondary menus.
   * @param user User details
   * @param link Link to display
   */
  private filter(user: User, link: MenuLink | MenuAction) {
    // If link has predicate function, test if returns true
    if (link.predicate) {
      return link.predicate(user);
    }
    return true;
  }
}
