import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuAction } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuButtonComponent {
  @Input() id: string;
  @Input() link: MenuAction;
  @Input() placement: "left" | "right";

  constructor() {}
}
