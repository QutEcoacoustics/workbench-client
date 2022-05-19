import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StepperComponent } from "./stepper.component";

@NgModule({
  declarations: [StepperComponent],
  imports: [CommonModule],
  exports: [StepperComponent],
})
export class StepperModule {}
