import { menuModal } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultAnnotationDownloadIcon } from "src/app/app.menus";
import { pointMenuItem } from "./points.menus";
import { deleteSiteModal } from "./sites.modals";

export const pointAnnotationsModal = menuModal({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this point",
  component: AnnotationDownloadComponent,
  modalOpts: {},
});

export const deletePointModal = menuModal({
  ...deleteSiteModal,
  label: "Delete point",
  parent: pointMenuItem,
  tooltip: () => "Delete this point",
  component: DeleteModalComponent,
});
