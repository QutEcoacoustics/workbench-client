import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { AppConfigService } from "@services/app-config/app-config.service";

/**
 * Work In Progress Component
 */
@Component({
  selector: "baw-wip",
  template: `
    <p class="h1 text-warning text-center">Work In Progress</p>
    <div class="wrapper" [ngbTooltip]="tooltip">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ["./wip.component.scss"],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WIPComponent implements OnInit {
  public tooltip: string;

  public constructor(private env: AppConfigService) {}

  public ngOnInit() {
    this.tooltip = this.env.config.production
      ? "This feature is currently not functional."
      : null;
  }
}
