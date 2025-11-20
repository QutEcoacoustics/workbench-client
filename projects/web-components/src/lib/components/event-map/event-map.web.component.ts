import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from "@angular/core";
import { IAudioEventGroup } from "../../interfaces/audio-event-group.interface";

@Component({
  selector: "baw-wc-event-map",
  templateUrl: "./event-map.web.component.html",
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapWebComponent {
  public readonly events = input.required<IAudioEventGroup[]>();
}
