import { StrongRoute } from "@interfaces/strongRoute";

export const annotationsImportRoute = StrongRoute.newRoot().addFeatureModule("import_annotations");
export const newAnnotationImportRoute = annotationsImportRoute.add("new");

export const annotationImportRoute = annotationsImportRoute.add(":annotationId");
export const addAnnotationImportRoute = annotationImportRoute.add("add_annotations", undefined);
