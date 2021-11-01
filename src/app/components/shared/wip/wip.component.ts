import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ConfigService } from "@services/config/config.service";

/**
 * Work In Progress Component
 */
@Component({
  selector: "baw-wip",
  template: `
    <ng-container *ngIf="!production">
      <p class="h1 text-warning text-center">Work In Progress</p>
      <div class="wip-wrapper">
        <ng-content></ng-content>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .wip-wrapper {
        background-color: rgba(0, 0, 0, 0.2);
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WIPComponent implements OnInit {
  public production: boolean;

  public constructor(private config: ConfigService) {}

  public ngOnInit() {
    this.production = this.config.config.production;
  }
}
