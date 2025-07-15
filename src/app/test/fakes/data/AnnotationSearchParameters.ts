import { Params } from "@angular/router";
import {
  IAnnotationSearchParameters,
  SelectKey,
  SortingKey,
  sortingOptions,
} from "@components/annotations/pages/annotationSearchParameters";
import { modelData } from "@test/helpers/faker";

export function generateAnnotationSearchParameters(
  data?: Partial<IAnnotationSearchParameters>,
): Required<IAnnotationSearchParameters> {
  return {
    audioRecordings: modelData.ids(),
    tags: modelData.ids(),
    importFiles: modelData.ids(),
    daylightSavings: modelData.bool(),
    recordingDate: [modelData.dateTime(), modelData.dateTime()],
    recordingTime: [modelData.time(), modelData.time()],

    score: [modelData.datatype.number(), modelData.datatype.number()],

    projects: modelData.ids(),
    regions: modelData.ids(),
    sites: modelData.ids(),

    routeProjectId: modelData.id(),
    routeRegionId: modelData.id(),
    routeSiteId: modelData.id(),

    eventDate: [modelData.dateTime(), modelData.dateTime()],
    eventTime: [modelData.time(), modelData.time()],
    sort: modelData.helpers.arrayElement(
      // We need to type cast Object.keys here because lib.d's implementation of
      // Object.keys does not maintain object structural typing, and will return
      // string[], which incorrectly broadens the type.
      Object.keys(sortingOptions) as SortingKey[],
    ),
    select: modelData.helpers.arrayElement(
      Object.keys(sortingOptions) as SelectKey[],
    ),
    ...data,
  };
}

export function generateAnnotationSearchUrlParameters(data?: Params): Params {
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
