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
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  successCallback: (pageComponentInstance?: AnnotationImportDetailsComponent) =>
    pageComponentInstance!.deleteModel(),
});
