import { NgModule } from '@angular/core';
import { FormTouchedGuard } from './form/form.guard';

@NgModule({
  providers: [FormTouchedGuard],
})
export class GuardModule {}
