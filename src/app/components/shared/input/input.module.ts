import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { IconsModule } from "@shared/icons/icons.module";
import { DateComponent } from "./date/date.component";
import { TimeComponent } from "./time/time.component";

const components = [DateComponent, TimeComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, IconsModule, NgbDatepickerModule, FormsModule],
  exports: components,
})
export class InputModule {}
