import { defaultDeleteIcon, isLoggedInPredicate } from "src/app/app.menus";
import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { DetailsComponent } from "@components/projects/pages/details/details.component";
import { annotationsImportMenuItem } from "./import-annotations.menu";

export const deleteAnnotationImportModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete annotation import",
  parent: annotationsImportMenuItem,
  tooltip: () => "Delete this annotation import",
  predicate: isLoggedInPredicate,
  component: DeleteModalComponent,
  successCallback: (pageComponentInstance?: DetailsComponent) => pageComponentInstance.deleteModel(),
});
