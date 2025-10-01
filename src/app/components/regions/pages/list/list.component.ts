import { Component, inject } from "@angular/core";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  shallowNewRegionMenuItem,
  shallowRegionsCategory,
  shallowRegionsMenuItem,
} from "@components/regions/regions.menus";
import { List } from "immutable";
import { Region } from "@models/Region";
import { ModelListComponent, modelListImports } from "@shared/model-list/model-list.component";
import { MODEL_LIST_SERVICE } from "@shared/model-list/model-list.tokens";
import { ShallowRegionsService } from "@baw-api/region/regions.service";

export const regionsMenuItemActions = [
  shallowNewRegionMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-regions",
  templateUrl: "../../../shared/model-list/model-list.component.html",
  styleUrl: "../../../shared/model-list/model-list.component.scss",
  imports: modelListImports,
  providers: [
    { provide: MODEL_LIST_SERVICE, useExisting: ShallowRegionsService },
  ],
})
class RegionListComponent extends ModelListComponent<Region> {}

RegionListComponent.linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowRegionsMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { RegionListComponent };
