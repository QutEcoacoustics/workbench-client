import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventGroup, IAudioEventGroup } from "@models/AudioEventGroup";
import { Site } from "@models/Site";
import { EventMapComponent } from "@shared/event-map/event-map.component";

@Component({
  selector: "private-oe-event-map",
  template: `
    <baw-event-map
      [events]="constructedEvents()"
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

      baw-event-map {
        display: block !important;
        width: 100%;
        height: 40rem;
      }
    `,
  ],
  imports: [EventMapComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMapWebComponent {
  public readonly events = input<IAudioEventGroup[]>([]);
  public readonly siteFocused = output<Id<Site>>();

  protected readonly constructedEvents = computed(() => {
    return this.events().map((model) => new AudioEventGroup(model));
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'baw-event-map': NgElement & WithProperties<{
      siteFocused: Id<Site>;
      events: AudioEventGroup[];
    }>;
  }
}
