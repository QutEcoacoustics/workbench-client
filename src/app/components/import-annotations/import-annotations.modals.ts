import { defaultDeleteIcon, isLoggedInPredicate } from "src/app/app.menus";
import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { annotationsImportMenuItem } from "./import-annotations.menu";
import { AnnotationImportDetailsComponent } from "./pages/details/details.component";

export const deleteAnnotationImportModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete annotation import",
  parent: annotationsImportMenuItem,
  tooltip: () => "Delete this annotation import",
  predicate: isLoggedInPredicate,
  component: DeleteModalComponent,
  successCallback: (pageComponentInstance?: AnnotationImportDetailsComponent) =>
    pageComponentInstance.deleteModel(),
});
