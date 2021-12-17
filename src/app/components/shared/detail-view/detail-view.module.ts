import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { PipesModule } from "@pipes/pipes.module";
import { CheckboxModule } from "@shared/checkbox/checkbox.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { TimezoneModule } from "@shared/timezone/timezone.module";
import { DetailViewComponent } from "./detail-view.component";
import { ModelLinkComponent } from "./model-link/model-link.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

@NgModule({
  declarations: [RenderFieldComponent, DetailViewComponent, ModelLinkComponent],
  imports: [
    CheckboxModule,
    CommonModule,
    DirectivesModule,
    LoadingModule,
    PipesModule,
    TimezoneModule,
  ],
  exports: [RenderFieldComponent, DetailViewComponent],
})
export class DetailViewModule {}
