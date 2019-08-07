import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuRoute } from "src/app/interfaces/layout-menus.interfaces";

@Component({
  selector: "app-menu-internal-link",
  templateUrl: "./internal-link.component.html",
  styleUrls: ["./internal-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuInternalLinkComponent {
  @Input() link: MenuRoute;
  @Input() placement: "left" | "right";

  constructor() {}
}
