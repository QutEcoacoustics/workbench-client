import { ModalMenuItem } from "@menu/widgetItem";
import { AnnotationDownloadComponent } from "@shared/annotation-download/annotation-download.component";
import { siteAnnotationsMenuItem } from "./sites.menus";

export const siteAnnotationsModal = new ModalMenuItem(
  siteAnnotationsMenuItem,
  AnnotationDownloadComponent
);
