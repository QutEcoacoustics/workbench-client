import { Provider } from "@angular/core";
import { StrongRoute } from "@interfaces/strongRoute";
import { ImportAnnotationService } from "./services/import-annotation.service";

// Because the annotation import service keeps track of the current annotation
// import including what files have been uploaded, what errors are present, etc.
// We attach the service to the route and recreate it every time the route loads
// so that the risk of stale state is significantly reduced.
const providers = [
  {
    provide: ImportAnnotationService,
    useFactory: () => new ImportAnnotationService(),
  },
] as const satisfies Provider[];

export const annotationsImportRoute = StrongRoute.newRoot().addFeatureModule("import_annotations");
export const newAnnotationImportRoute = annotationsImportRoute.add("new");

export const annotationImportRoute = annotationsImportRoute.add(":annotationId");
export const addAnnotationImportRoute = annotationImportRoute.add("add_annotations", undefined, { providers });
