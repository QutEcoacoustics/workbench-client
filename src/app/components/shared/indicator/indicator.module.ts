import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconsModule } from '@shared/icons/icons.module';
import { IndicatorComponent } from './indicator.component';

@NgModule({
  declarations: [IndicatorComponent],
  imports: [CommonModule, IconsModule],
  exports: [IndicatorComponent],
})
export class IndicatorModule {}
