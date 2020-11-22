import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { Filters } from "@baw-api/baw-api.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myAnnotationsMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-annotations",
  templateUrl: "./annotations.component.html",
})
class MyAnnotationsComponent extends PagedTableTemplate<TableRow, AudioEvent> {
  public columns = [{ name: "Site" }, { name: "Updated" }, { name: "Tags" }];
  public sortKeys = { updated: "updatedAt" };
  protected api: ShallowAudioEventsService;

  public constructor(api: ShallowAudioEventsService, route: ActivatedRoute) {
    super(
      api,
      (audioEvents) =>
        audioEvents.map((audioEvent) => ({
          site: audioEvent,
          updated: audioEvent.updatedAt.toRelative(),
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
    return this.api.filterByCreator(filters, this.api.getLocalUser().id);
  }
}

MyAnnotationsComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myAnnotationsMenuItem);

export { MyAnnotationsComponent };

interface TableRow {
  site: AudioEvent;
  updated: string;
  tags: AudioEvent;
  model: AudioEvent;
}
