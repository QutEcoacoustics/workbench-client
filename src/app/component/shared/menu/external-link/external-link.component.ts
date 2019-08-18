import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuLink } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-external-link",
  templateUrl: "./external-link.component.html",
  styleUrls: ["./external-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuExternalLinkComponent {
  @Input() id: string;
  @Input() link: MenuLink;
  @Input() placement: "left" | "right";

  constructor() {}
}
