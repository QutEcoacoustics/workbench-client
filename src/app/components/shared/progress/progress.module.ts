import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ProgressBarComponent } from "./bar/bar.component";
import { ProgressComponent } from "./progress/progress.component";

const components = [ProgressComponent, ProgressBarComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, NgbTooltipModule],
})
export class ProgressModule {}
