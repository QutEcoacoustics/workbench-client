import { menuModal } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { defaultAnnotationDownloadIcon } from "src/app/app.menus";

export const pointAnnotationsModal = menuModal({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this point",
  component: AnnotationDownloadComponent,
  pageData: {},
  modalOpts: {},
});
