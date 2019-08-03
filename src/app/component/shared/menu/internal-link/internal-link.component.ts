import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MenuItemTypes } from "src/app/interfaces/layout-menus.interfaces";

@Component({
  selector: "app-menu-internal-link",
  templateUrl: "./internal-link.component.html",
  styleUrls: ["./internal-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuInternalLinkComponent {
  @Input() link: MenuItemTypes;
  @Input() placement: "left" | "right";

  constructor() {}
}
