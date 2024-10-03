import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AudioEventCardComponent } from "./audio-event-card.component";

@NgModule({
  declarations: [AudioEventCardComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [AudioEventCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AudioEventCardModule {}
