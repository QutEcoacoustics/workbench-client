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
import { AudioRecording } from "@models/AudioRecording";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-annotations",
  templateUrl: "./annotations.component.html",
})
class MyAnnotationsComponent extends PagedTableTemplate<TableRow, AudioEvent> {
  public columns = [{ name: "Site" }, { name: "Uploaded" }, { name: "Tags" }];
  protected api: ShallowAudioEventsService;

  constructor(api: ShallowAudioEventsService, route: ActivatedRoute) {
    super(
      api,
      (audioEvents) => {
        console.log({ audioEvents });

        return audioEvents.map((audioEvent) => ({
          site: audioEvent,
          uploaded: audioEvent,
          tags: audioEvent,
        }));
      },
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }

  protected apiAction(filters: Filters<IAudioEvent>) {
    return this.api.filterByCreator({ paging: filters.paging }, 3);
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
  uploaded: AudioEvent;
  tags: AudioEvent;
}
