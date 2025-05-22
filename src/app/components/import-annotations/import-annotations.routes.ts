import { StrongRoute } from "@interfaces/strongRoute";

/** /import_annotations */
export const annotationsImportRoute = StrongRoute.newRoot().addFeatureModule("import_annotations");

/** /import_annotations/new */
export const newAnnotationImportRoute = annotationsImportRoute.add("new");

/** /import_annotations/:annotationId */
export const annotationImportRoute = annotationsImportRoute.add(":annotationId");

/** /import_annotations/:annotationId/add_annotations */
export const addAnnotationImportRoute = annotationImportRoute.add("add_annotations");
