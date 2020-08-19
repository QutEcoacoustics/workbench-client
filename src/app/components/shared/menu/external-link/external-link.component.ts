import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
} from "@angular/core";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { MenuLink } from "src/app/interfaces/menusInterfaces";

/**
 * External Menu Link Component
 */
@Component({
  selector: "baw-menu-external-link",
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuExternalLinkComponent implements OnInit {
  @Input() public id: string;
  @Input() public link: MenuLink;
  @Input() public placement: "left" | "right";
  @Input() public tooltip: string;
  @Input() public uri: string;

  constructor(@Inject(API_ROOT) private apiRoot: string) {}

  public ngOnInit() {
    if (this.uri.startsWith("/")) {
      this.uri = this.apiRoot + this.uri;
    }
  }
}
