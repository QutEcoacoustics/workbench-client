import { menuModal } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultAnnotationDownloadIcon, defaultDeleteIcon, isProjectEditorPredicate } from "src/app/app.menus";
import { siteMenuItem } from "./sites.menus";
import { SiteDetailsComponent } from "./pages/details/details.component";

export const siteAnnotationsModal = menuModal({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this site",
  component: AnnotationDownloadComponent,
  modalOpts: {},
});

export const deleteSiteModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete site",
  parent: siteMenuItem,
  tooltip: () => "Delete this site",
  predicate: isProjectEditorPredicate,
  component: DeleteModalComponent,
  successCallback: (pageComponentInstance?: SiteDetailsComponent) => pageComponentInstance.deleteModel(),
});
