import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconsModule } from "@shared/icons/icons.module";
import { StepperComponent } from "./stepper.component";

@NgModule({
  declarations: [StepperComponent],
  imports: [CommonModule, IconsModule],
  exports: [StepperComponent],
})
export class StepperModule {}
