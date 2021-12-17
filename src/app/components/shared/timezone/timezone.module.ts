import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TimezoneComponent } from "./timezone.component";

@NgModule({
  declarations: [TimezoneComponent],
  imports: [CommonModule, NgbTooltipModule],
  exports: [TimezoneComponent],
})
export class TimezoneModule {}
