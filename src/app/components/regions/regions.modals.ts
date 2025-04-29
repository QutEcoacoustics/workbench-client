import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultAnnotationDownloadIcon, defaultDeleteIcon, isProjectEditorPredicate } from "src/app/app.menus";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { regionMenuItem } from "./regions.menus";
import { RegionDetailsComponent } from "./pages/details/details.component";

export const deleteRegionModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete site",
  parent: regionMenuItem,
  tooltip: () => "Delete this site",
  predicate: isProjectEditorPredicate,
  component: DeleteModalComponent,
  successCallback: (pageComponentInstance?: RegionDetailsComponent) => pageComponentInstance.deleteModel(),
});

export const regionAnnotationsModal = menuModal({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this site",
  component: AnnotationDownloadComponent,
  modalOpts: {},
});
