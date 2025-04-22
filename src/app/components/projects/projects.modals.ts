import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultAnnotationDownloadIcon, defaultDeleteIcon, isProjectEditorPredicate } from "src/app/app.menus";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { projectMenuItem } from "./projects.menus";
import { ProjectDetailsComponent } from "./pages/details/details.component";

export const projectAnnotationsModal = menuModal({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this project",
  component: AnnotationDownloadComponent,
  modalOpts: {},
});

export const deleteProjectModal = menuModal({
  icon: defaultDeleteIcon,
  label: "Delete project",
  parent: projectMenuItem,
  tooltip: () => "Delete this project",
  predicate: isProjectEditorPredicate,
  component: DeleteModalComponent,
  successCallback: (pageComponentInstance?: ProjectDetailsComponent) => pageComponentInstance.deleteModel(),
});
