import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultDeleteIcon, isAdminPredicate } from "src/app/app.menus";
import { AdminTagGroupsEditComponent } from "./edit/edit.component";
import { adminTagGroupsMenuItem } from "./tag-group.menus";

export const adminDeleteTagGroupModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete Tag Group",
  parent: adminTagGroupsMenuItem,
  tooltip: () => "Delete an existing tag group",
  predicate: isAdminPredicate,
  component: DeleteModalComponent,
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  successCallback: (pageComponentInstance?: AdminTagGroupsEditComponent) => pageComponentInstance!.deleteModel(),
});

