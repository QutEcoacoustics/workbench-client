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
  User,
  isInternalRoute,
  isExternalLink,
  isButton
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
  @Input() links: List<MenuAction | MenuLink>;
  @Input() menuType: "action" | "secondary";

  filteredLinks: List<MenuAction | MenuLink>;

  isInternalLink = isInternalRoute;
  isExternalLink = isExternalLink;
  isButton = isButton;
  isAction = isButton;

  ngOnInit() {
    // Get user details
    const user: User = this.api.user;
    this.filteredLinks = this.links.filter(link => this.filter(user, link));
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
