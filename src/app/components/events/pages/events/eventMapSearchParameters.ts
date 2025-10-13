import { IAnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { Site } from "@models/Site";

export interface IEventMapSearchParameters extends IAnnotationSearchParameters {
  focused?: Site["id"];
}
