import { menuModal } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { defaultAnnotationDownloadIcon, defaultDeleteIcon, isProjectEditorPredicate } from "src/app/app.menus";
import { siteMenuItem } from "./sites.menus";
import { SiteDetailsComponent } from "./pages/details/details.component";
import { DeleteSiteModalComponent } from "./components/delete-site-modal/delete-site-modal.component";

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
  component: DeleteSiteModalComponent,
  successCallback: (pageComponentInstance?: SiteDetailsComponent) => pageComponentInstance.deleteModel(),
  options: {
    isPoint: false,
  },
});
