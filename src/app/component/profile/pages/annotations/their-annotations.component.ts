import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { AudioEventsService } from "@baw-api/audio-event/audio-events.service";
import {
  theirAnnotationsMenuItem,
  theirProfileCategory,
  theirProfileMenuItem,
} from "@component/profile/profile.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { User } from "@models/User";
import { List } from "immutable";
import { theirProfileActions } from "../profile/their-profile.component";

const accountKey = "user";

@Component({
  selector: "app-their-annotations",
  templateUrl: "./annotations.component.html",
})
class TheirAnnotationsComponent extends PagedTableTemplate<
  TableRow,
  AudioEvent
> {
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
    return this.models[accountKey] as User;
  }
}

TheirAnnotationsComponent.WithInfo({
  category: theirProfileCategory,
  menus: {
    actions: List<AnyMenuItem>([theirProfileMenuItem, ...theirProfileActions]),
  },
  resolvers: { [accountKey]: accountResolvers.show },
  self: theirAnnotationsMenuItem,
});

export { TheirAnnotationsComponent };

interface TableRow {
  site: Site;
  uploaded: string;
  tags: Tag[];
}
