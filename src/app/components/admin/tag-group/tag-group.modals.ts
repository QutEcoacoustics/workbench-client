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
  // @ts-expect-error: strict mode fix
  successCallback: (pageComponentInstance?: AdminTagGroupsEditComponent) => pageComponentInstance!.deleteModel(),
});

