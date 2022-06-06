import { NgModule } from "@angular/core";
import { FormTouchedGuard } from "./form/form.guard";
import { UnsavedInputGuard } from "./input/input.guard";

@NgModule({
  providers: [FormTouchedGuard, UnsavedInputGuard],
})
export class GuardModule {}
