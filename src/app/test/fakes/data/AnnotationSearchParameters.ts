import { Params } from "@angular/router";
import { modelData } from "@test/helpers/faker";

export function generateAnnotationSearchUrlParams(data?: Params): Params {
  return {
    audioRecordings: modelData.ids().join(","),
    tags: modelData.ids().join(","),
    audioEventImports: modelData.ids().join(","),
    importFiles: modelData.ids().join(","),
    score: [modelData.datatype.number(), modelData.datatype.number()].join(","),
    daylightSavings: modelData.bool().toString(),
    projects: modelData.ids().join(","),
    regions: modelData.ids().join(","),
    sites: modelData.ids().join(","),
    time: [modelData.time(), modelData.time()].join(","),
    date: [modelData.dateTime(), modelData.dateTime()].join(","),
    ...data,
  };
}
