import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAnnotationsMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { User } from "@models/User";
import { List } from "immutable";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-annotations",
  templateUrl: "./annotations.component.html",
  standalone: false
})
class MyAnnotationsComponent extends PagedTableTemplate<TableRow, AudioEvent> {
  public columns = [{ name: "Site" }, { name: "Updated" }, { name: "Tags" }];
  public sortKeys = { updated: "updatedAt" };
  protected api: ShallowAudioEventsService;

  public constructor(
    api: ShallowAudioEventsService,
    route: ActivatedRoute,
    private session: BawSessionService
  ) {
    super(
      api,
      (audioEvents) =>
        audioEvents.map((audioEvent) => ({
          site: audioEvent,
          updated: audioEvent.updatedAt,
          tags: audioEvent,
          model: audioEvent,
        })),
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }

  protected apiAction(filters: Filters<IAudioEvent>) {
    return this.api.filterByCreator(filters, this.session.loggedInUser?.id);
  }
}

MyAnnotationsComponent.linkToRoute({
  category: myAccountCategory,
  pageRoute: myAnnotationsMenuItem,
  menus: { actions: List(myAccountActions) },
  resolvers: { [userKey]: userResolvers.show },
});

export { MyAnnotationsComponent };

interface TableRow {
  site: AudioEvent;
  updated: DateTimeTimezone;
  tags: AudioEvent;
  model: AudioEvent;
}
