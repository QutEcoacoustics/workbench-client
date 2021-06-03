import { ModalMenuItem } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { pointAnnotationsMenuItem } from "./points.menus";

export const pointAnnotationsModal = new ModalMenuItem(
  pointAnnotationsMenuItem,
  AnnotationDownloadComponent
);
