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

    routeProjectId: modelData.id(),
    routeRegionId: modelData.id(),
    routeSiteId: modelData.id(),

    audioRecordings: modelData.ids(),
    tags: modelData.ids(),
    onlyUnverified: modelData.bool(),
    recordingTime: [modelData.time(), modelData.time()],
    recordingDate: [modelData.dateTime(), modelData.dateTime()],
    eventDate: [modelData.dateTime(), modelData.dateTime()],
    eventTime: [modelData.time(), modelData.time()],
    daylightSavings: modelData.bool(),
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
