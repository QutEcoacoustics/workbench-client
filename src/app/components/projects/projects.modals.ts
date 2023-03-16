import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultDeleteIcon, isProjectEditorPredicate } from "src/app/app.menus";
import { projectMenuItem } from "./projects.menus";
import { DetailsComponent } from "./pages/details/details.component";

export const deleteProjectModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete project",
  parent: projectMenuItem,
  tooltip: () => "Delete this project",
  predicate: isProjectEditorPredicate,
  component: DeleteModalComponent,
  successCallback: (pageComponentInstance?: DetailsComponent) => pageComponentInstance.deleteModel(),
});
