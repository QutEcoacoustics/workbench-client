import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ConfigService } from "@services/config/config.service";

/**
 * Work In Progress Component
 */
@Component({
  selector: "baw-wip",
  template: `
    <ng-container *ngIf="showWipContent; else placeholder">
      <div class="wip-wrapper" ngbTooltip="This feature is a work in progress">
        <ng-container *ngTemplateOutlet="icon"></ng-container>

        <div class="wip-content">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-container>

    <ng-template #placeholder>
      <div
        class="wip-placeholder"
        ngbTooltip="This feature is a work in progress"
      >
        <ng-container *ngTemplateOutlet="icon"></ng-container>
        <p class="wip-text">
          This section is a work in progress. Expect new things here soon!
        </p>
      </div>
    </ng-template>

    <ng-template #icon>
      <div class="wip-icon">
        <fa-icon size="lg" [icon]="['fas', 'person-digging']"></fa-icon>
      </div>
    </ng-template>
  `,
  styleUrls: ["wip.component.scss"],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WIPComponent implements OnInit {
  public production: boolean;

  public constructor(
    private session: BawSessionService,
    private config: ConfigService
  ) {}

  public ngOnInit(): void {
    this.production = this.config.environment.production;
  }

  public get showWipContent(): boolean {
    return !this.production || this.session.loggedInUser?.isAdmin;
  }
}
