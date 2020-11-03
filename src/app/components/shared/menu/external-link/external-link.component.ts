import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { MenuLink } from "@interfaces/menusInterfaces";

/**
 * External Menu Link Component
 */
@Component({
  selector: "baw-menu-external-link",
  template: `
    <!--
      No tooltips for disabled links because of:
      https://github.com/ng-bootstrap/ng-bootstrap/issues/1250#issuecomment-274916839
    -->
    <a
      class="nav-link"
      [ngClass]="{ disabled: disabled }"
      [href]="href"
      [placement]="placement"
      [ngbTooltip]="tooltip"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">{{ tooltip }}</span>
    </a>
  `,
  styleUrls: ["./external-link.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuExternalLinkComponent implements OnChanges {
  @Input() public id: string;
  @Input() public link: MenuLink;
  @Input() public placement: "left" | "right";
  @Input() public tooltip: string;
  @Input() public uri: string;
  public href: string;
  public disabled: boolean;

  constructor(@Inject(API_ROOT) private apiRoot: string) {}

  public ngOnChanges() {
    this.disabled = this.link.disabled;
    // Prepend apiRoot to relative links
    this.href = this.uri.startsWith("/") ? this.apiRoot + this.uri : this.uri;
  }
}
