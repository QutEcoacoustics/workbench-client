import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultDeleteIcon, isAdminPredicate } from "src/app/app.menus";
import { AdminTagsEditComponent } from "./edit/edit.component";
import { adminTagsMenuItem } from "./tags.menus";

export const adminDeleteTagModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete Tag",
  parent: adminTagsMenuItem,
  tooltip: () => "Delete an existing tag",
  predicate: isAdminPredicate,
  component: DeleteModalComponent,
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  successCallback: (pageComponentInstance?: AdminTagsEditComponent) => pageComponentInstance!.deleteModel(),
});

