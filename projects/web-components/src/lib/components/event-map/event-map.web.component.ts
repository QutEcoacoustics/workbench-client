import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { Site } from "@models/Site";
import { EventMapComponent } from "@shared/event-map/event-map.component";

@Component({
  selector: "private-oe-event-map",
  template: `
    <baw-event-map
      [events]="events()"
      (siteFocused)="siteFocused.emit($event)"
    />
  `,
  styles: [
    `
      :host {
        display: contents;
        position: relative;
        contain: content;
      }
    `,
  ],
  imports: [EventMapComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapWebComponent {
  public readonly events = input<AudioEventGroup[]>([]);
  public readonly siteFocused = output<Id<Site>>();
}

declare global {
  interface HTMLElementTagNameMap {
    'baw-event-map': NgElement & WithProperties<{
      siteFocused: Id<Site>;
      events: AudioEventGroup[];
    }>;
  }
}
