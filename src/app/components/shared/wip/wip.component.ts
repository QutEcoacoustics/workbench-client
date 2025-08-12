import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

/**
 * Work In Progress Component
 */
@Component({
  selector: "baw-wip",
  template: `
    @if (showWipContent) {
      <div class="wip-wrapper" [ngbTooltip]="'This feature is a work in progress'">
        <div class="wip-icon">
          <fa-icon size="lg" [icon]="['fas', 'person-digging']"></fa-icon>
        </div>

        <div class="wip-content">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
  styleUrl: "./wip.component.scss",
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTooltip, FaIconComponent]
})
export class WIPComponent {
  public production: boolean;
  private session = inject(BawSessionService);

  public get showWipContent(): boolean {
    return this.session.loggedInUser?.isAdmin;
  }
}
