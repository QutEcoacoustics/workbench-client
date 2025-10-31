import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from "@angular/core";
import { EventMapComponent } from "../../../../../../src/app/components/shared/event-map/event-map.component";
import { AudioEventGroup } from "@models/AudioEventGroup";

@Component({
  selector: "baw-wc-event-map",
  templateUrl: "./event-map.web.component.html",
  imports: [EventMapComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapWebComponent {
  public readonly events = input.required<AudioEventGroup[]>();
}
