import { Provider } from "@angular/core";
import { StrongRoute } from "@interfaces/strongRoute";
import { ImportAnnotationService } from "./services/import-annotation.service";

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
