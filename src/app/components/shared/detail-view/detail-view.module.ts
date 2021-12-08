import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { PipesModule } from "@pipes/pipes.module";
import { CheckboxModule } from "@shared/checkbox/checkbox.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { DetailViewComponent } from "./detail-view.component";
import { ModelLinkComponent } from "./model-link/model-link.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

@NgModule({
  declarations: [RenderFieldComponent, DetailViewComponent, ModelLinkComponent],
  imports: [
    AuthenticatedImageModule,
    CheckboxModule,
    CommonModule,
    DirectivesModule,
    LoadingModule,
    PipesModule,
  ],
  exports: [RenderFieldComponent, DetailViewComponent],
})
export class DetailViewModule {}
