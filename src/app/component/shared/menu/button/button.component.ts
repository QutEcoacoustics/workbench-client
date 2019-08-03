import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MenuAction } from "src/app/interfaces/layout-menus.interfaces";

@Component({
  selector: "app-menu-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuButtonComponent {
  @Input() link: MenuAction;
  @Input() placement: "left" | "right";

  constructor() {}
}
