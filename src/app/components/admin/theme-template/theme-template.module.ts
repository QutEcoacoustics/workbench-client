import { NgModule } from "@angular/core";
import { NgbButtonsModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "@shared/shared.module";
import { AdminThemeTemplateComponent } from "./theme-template.component";

@NgModule({
  declarations: [AdminThemeTemplateComponent],
  imports: [SharedModule, NgbButtonsModule],
  exports: [AdminThemeTemplateComponent],
})
export class ThemeTemplateModule {}
