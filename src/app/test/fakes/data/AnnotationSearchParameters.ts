import { Params } from "@angular/router";
import { modelData } from "@test/helpers/faker";

export function generateAnnotationSearchUrlParams(data?: Params): Params {
  return {
    audioRecordings: modelData.ids().join(","),
    tags: modelData.ids().join(","),
    score: [modelData.datatype.number(), modelData.datatype.number()].join(","),
    daylightSavings: modelData.bool().toString(),
    projects: modelData.ids().join(","),
    regions: modelData.ids().join(","),
    sites: modelData.ids().join(","),
    time: [modelData.time(), modelData.time()].join(","),
    date: [modelData.dateTime(), modelData.dateTime()].join(","),
    // We have a minimum of 2 imports so that the expected filter generation
    // will always use an "OR" condition.
    // If we allowed this to have a single item, the filter generation would use
    // a simple equality check instead which would create some flaky tests.
    imports: modelData
      .randomArray(2, 5, () => `${modelData.id()}:${modelData.id()}`)
      .join(","),
    ...data,
  };
}
