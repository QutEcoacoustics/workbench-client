import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { userResolvers } from "@baw-api/user/user.service";
import {
  myAccountCategory,
  myAccountMenuItem,
  myAnnotationsMenuItem,
} from "@components/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { List } from "immutable";
import { myAccountActions } from "../profile/my-profile.component";

const userKey = "user";

@Component({
  selector: "app-my-annotations",
  templateUrl: "./annotations.component.html",
})
class MyAnnotationsComponent extends PagedTableTemplate<TableRow, AudioEvent> {
  constructor(api: AudioEventsService, route: ActivatedRoute) {
    super(
      api,
      (audioEvents) => {
        // TODO Implement
        return [];
      },
      route
    );
  }

  public get account(): User {
    return this.models[userKey] as User;
  }
}

MyAnnotationsComponent.LinkComponentToPageInfo({
  category: myAccountCategory,
  menus: {
    actions: List<AnyMenuItem>([myAccountMenuItem, ...myAccountActions]),
  },
  resolvers: { [userKey]: userResolvers.show },
}).AndMenuRoute(myAnnotationsMenuItem);

export { MyAnnotationsComponent };

interface TableRow {
  site: Site;
  uploaded: string;
  tags: Tag[];
}
