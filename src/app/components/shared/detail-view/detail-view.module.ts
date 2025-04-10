import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { PipesModule } from "@pipes/pipes.module";


import { DurationComponent } from "@shared/datetime-formats/duration/duration.component";
import { TimeSinceComponent } from "../datetime-formats/time-since/time-since.component";
import { ZonedDateTimeComponent } from "../datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { DatetimeComponent } from "../datetime-formats/datetime/datetime/datetime.component";
import { DetailViewComponent } from "./detail-view.component";
import { ModelLinkComponent } from "./model-link/model-link.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

@NgModule({
    exports: [RenderFieldComponent, DetailViewComponent],
    imports: [
    CommonModule,
    DirectivesModule,
    PipesModule,
    DurationComponent,
    TimeSinceComponent,
    ZonedDateTimeComponent,
    DatetimeComponent,
    RenderFieldComponent, DetailViewComponent, ModelLinkComponent
]
})
export class DetailViewModule {}
