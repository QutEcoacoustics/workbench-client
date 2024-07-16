import { Params } from "@angular/router";
import { IAnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { modelData } from "@test/helpers/faker";

export function generateAnnotationSearchParameters(
  data?: Partial<IAnnotationSearchParameters>
): Required<IAnnotationSearchParameters> {
  return {
    projects: modelData.ids(),
    regions: modelData.ids(),
    sites: modelData.ids(),
    tags: modelData.ids(),
    onlyUnverified: modelData.bool(),
    time: [modelData.time(), modelData.time()],
    date: [modelData.dateTime(), modelData.dateTime()],
    ...data,
  };
}

export function generateAnnotationSearchUrlParameters(
  data?: Params
): Params {
  return {
    projects: modelData.ids().join(","),
    regions: modelData.ids().join(","),
    sites: modelData.ids().join(","),
    tags: modelData.ids().join(","),
    onlyUnverified: modelData.bool(),
    time: [modelData.time(), modelData.time()].join(","),
    date: [modelData.dateTime(), modelData.dateTime()].join(","),
    ...data,
  };
}
