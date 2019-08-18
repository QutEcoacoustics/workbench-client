import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-internal-link",
  templateUrl: "./internal-link.component.html",
  styleUrls: ["./internal-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuInternalLinkComponent {
  @Input() id: string;
  @Input() link: MenuRoute;
  @Input() placement: "left" | "right";

  constructor() {}
}
