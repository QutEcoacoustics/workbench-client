import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myAnnotationsMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "baw-my-annotations",
  templateUrl: "./annotations.component.html",
})
class MyAnnotationsComponent extends PagedTableTemplate<
  TableRow,
  AudioRecording
> {
  protected api: AudioRecordingsService;

  constructor(api: AudioRecordingsService, route: ActivatedRoute) {
    super(
      api,
      (audioRecordings) => {
        console.log({ audioEvents: audioRecordings });

        // TODO Implement
        return [];
      },
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }

  protected apiAction(filters: Filters<IAudioRecording>) {
    return this.api.filter({
      paging: filters.paging,
      filter: {
        and: { audio_events: { creator_id: { eq: this.account.id } } },
      },
    } as Filters<IAudioRecording>);
  }
}

MyAnnotationsComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: { actions: List([myAccountMenuItem, ...myAccountActions]) },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myAnnotationsMenuItem);

export { MyAnnotationsComponent };

interface TableRow {
  site: Site;
  uploaded: string;
  tags: Tag[];
}
