import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AudioEventCardComponent } from "./audio-event-card.component";

@NgModule({
  declarations: [AudioEventCardComponent],
  imports: [CommonModule],
  exports: [AudioEventCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AudioEventCardModule {}
