import { menuModal } from "@menu/widgetItem";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { defaultAnnotationDownloadIcon, defaultDeleteIcon, isLoggedInPredicate, isProjectEditorPredicate } from "src/app/app.menus";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { projectMenuItem } from "./projects.menus";
import { ProjectDetailsComponent } from "./pages/details/details.component";

export const projectAnnotationsModal = menuModal({
  icon: defaultAnnotationDownloadIcon,
  label: "Download Annotations",
  tooltip: () => "Download annotations for this project",
  predicate: isLoggedInPredicate,
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
  // @ts-ignore: TODO: remove once strict mode is fully enabled, see https://github.com/QutEcoacoustics/workbench-client/issues/2686
  successCallback: (pageComponentInstance?: ProjectDetailsComponent) => pageComponentInstance!.deleteModel(),
});

