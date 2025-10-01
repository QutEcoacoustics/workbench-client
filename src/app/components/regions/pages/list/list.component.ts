import { Component } from "@angular/core";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  shallowNewRegionMenuItem,
  shallowRegionsCategory,
  shallowRegionsMenuItem,
} from "@components/regions/regions.menus";
import { List } from "immutable";
import { ModelListComponent } from "@shared/model-list/model-list.component";
import { MODEL_LIST_SERVICE } from "@shared/model-list/model-list.tokens";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { PageComponent } from "@helpers/page/pageComponent";

export const regionsMenuItemActions = [
  shallowNewRegionMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-regions",
  template: `
    <baw-model-list [modelKey]="'regions'"></baw-model-list>
  `,
  imports: [ModelListComponent],
  providers: [
    { provide: MODEL_LIST_SERVICE, useExisting: ShallowRegionsService },
  ],
})
class RegionListComponent extends PageComponent {}

RegionListComponent.linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowRegionsMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { RegionListComponent };
