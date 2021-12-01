import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { CheckboxModule } from "@shared/checkbox/checkbox.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { ModelLinkModule } from "@shared/model-link/model-link.module";
import { DetailViewComponent } from "./detail-view.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

@NgModule({
  declarations: [RenderFieldComponent, DetailViewComponent],
  imports: [
    CommonModule,
    CheckboxModule,
    ModelLinkModule,
    LoadingModule,
    DirectivesModule,
  ],
  exports: [RenderFieldComponent, DetailViewComponent],
})
export class DetailViewModule {}
