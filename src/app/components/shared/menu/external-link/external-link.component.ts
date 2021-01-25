import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { MenuLink } from "@interfaces/menusInterfaces";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

/**
 * External Menu Link Component
 */
@Component({
  selector: "baw-menu-external-link",
  template: `
    <span
      [placement]="placement"
      [ngbTooltip]="tooltip"
      [class.disabled]="link.disabled"
    >
      <a class="nav-link" [href]="href" [class.disabled]="link.disabled">
        <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
        <span id="label">{{ link.label }}</span>
        <span class="d-none" [id]="id">{{ tooltip }}</span>
      </a>
    </span>
  `,
  styleUrls: ["./external-link.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuExternalLinkComponent implements OnChanges {
  @Input() public id: string;
  @Input() public link: MenuLink;
  @Input() public placement: Placement;
  @Input() public tooltip: string;
  @Input() public uri: string;
  public href: string;

  public constructor(@Inject(API_ROOT) private apiRoot: string) {}

  public ngOnChanges() {
    // Prepend apiRoot to relative links
    this.href = this.uri.startsWith("/") ? this.apiRoot + this.uri : this.uri;
  }
}
