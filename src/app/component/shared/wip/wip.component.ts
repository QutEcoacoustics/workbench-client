import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { AppConfigService } from "src/app/services/app-config/app-config.service";

@Component({
  selector: "app-wip",
  template: `
    <p class="h1 text-warning text-center">Work In Progress</p>
    <div
      class="wrapper"
      [ngClass]="{ prodMode: prodMode }"
      [ngbTooltip]="tooltip"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ["./wip.component.scss"],
  // tslint:disable-next-line: use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WIPComponent implements OnInit {
  prodMode: boolean;
  tooltip: string;

  constructor(private env: AppConfigService) {}

  ngOnInit() {
    this.prodMode = this.env.config.production;

    this.tooltip = this.prodMode
      ? "This feature is currently not functional."
      : null;
  }
}
