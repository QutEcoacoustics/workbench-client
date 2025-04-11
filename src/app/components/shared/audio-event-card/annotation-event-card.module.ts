import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ZonedDateTimeComponent } from "@shared/datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { PipesModule } from "@pipes/pipes.module";
import { AnnotationEventCardComponent } from "./annotation-event-card.component";

@NgModule({
  declarations: [AnnotationEventCardComponent],
  imports: [CommonModule, FontAwesomeModule, PipesModule, ZonedDateTimeComponent],
  exports: [AnnotationEventCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AudioEventCardModule {}
