import { projectRoute } from "@components/projects/projects.routes";

/** /projects/:projectId/import_annotations */
export const annotationsImportRoute = projectRoute.addFeatureModule("import_annotations");

/** /projects/:projectId/import_annotations/new */
export const newAnnotationImportRoute = annotationsImportRoute.add("new");

/** /projects/:projectId/import_annotations/:annotationId */
export const annotationImportRoute = annotationsImportRoute.add(":annotationId");

/** /projects/:projectId/import_annotations/:annotationId/add_annotations */
export const addAnnotationImportRoute = annotationImportRoute.add("add_annotations");
