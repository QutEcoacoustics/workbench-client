import { Component, Input } from "@angular/core";
import { Verification } from "@models/Verification";

@Component({
  selector: "baw-audio-event-card",
  templateUrl: "audio-event-card.component.html",
  styleUrl: "audio-event-card.component.scss",
})
export class AudioEventCardComponent {
  @Input({ required: true }) public audioEvent: Verification;
}
