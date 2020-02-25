import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit
} from "@angular/core";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { MenuLink } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-external-link",
  template: `
    <a
      class="nav-link"
      href="{{ uri }}"
      placement="{{ placement }}"
      ngbTooltip="{{ tooltip }}"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ tooltip }}
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
  @Input() tooltip: string;
  @Input() uri: string;

  constructor(@Inject(API_ROOT) private apiRoot: string) {}

  ngOnInit() {
    if (this.uri.startsWith("/")) {
      this.uri = this.apiRoot + this.uri;
    }
  }
}
