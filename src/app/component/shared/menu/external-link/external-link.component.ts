import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { MenuLink } from "src/app/interfaces/menusInterfaces";
import { AppConfigService } from "src/app/services/app-config/app-config.service";

@Component({
  selector: "app-menu-external-link",
  template: `
    <a
      class="nav-link"
      href="{{ link.uri }}"
      placement="{{ placement }}"
      ngbTooltip="{{ link.tooltip() }}"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span>{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ link.tooltip() }}
      </span>
    </a>
  `,
  styleUrls: ["./external-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuExternalLinkComponent implements OnInit {
  @Input() id: string;
  @Input() link: MenuLink;
  @Input() placement: "left" | "right";

  constructor(private config: AppConfigService) {}

  ngOnInit() {
    if (this.link.uri.charAt(0) === "/") {
      this.link.uri =
        this.config.getConfig().environment.apiRoot + this.link.uri;
    }
  }
}
