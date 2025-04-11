/** A fake parameter data model used in the event summary reports */
import { Params } from "@angular/router";
import {
  BucketSize,
  Chart,
  IEventSummaryReportParameters,
} from "@components/reports/pages/event-summary/EventSummaryReportParameters";
import { faker } from "@faker-js/faker";
import { modelData } from "@test/helpers/faker";

export function generateEventSummaryReportParameters(
  data?: Partial<IEventSummaryReportParameters>,
): Required<IEventSummaryReportParameters> {
  return {
    sites: modelData.ids(),
    points: modelData.ids(),
    provenances: modelData.ids(),
    tags: modelData.ids(),
    score: modelData.percentage(),
    bucketSize: faker.helpers.arrayElement<BucketSize>([
      BucketSize.day,
      BucketSize.fortnight,
      BucketSize.month,
      BucketSize.season,
      BucketSize.week,
      BucketSize.year,
    ]),
    daylightSavings: faker.datatype.boolean(),
    time: [modelData.time(), modelData.time()],
    date: [modelData.dateTime(), modelData.dateTime()],
    charts: faker.helpers.shuffle([
      Chart.speciesAccumulationCurve,
      Chart.speciesCompositionCurve,
      Chart.falseColorSpectrograms,
      Chart.none,
    ]),
    ...data,
  };
}

export function generateEventSummaryReportUrlParameters(data?: Params): Params {
  return {
    sites: modelData.ids().join(","),
    points: modelData.ids().join(","),
    provenances: modelData.ids().join(","),
    tags: modelData.ids().join(","),
    score: modelData.percentage(),
    bucketSize: faker.helpers.arrayElement<BucketSize>([
      BucketSize.day,
      BucketSize.fortnight,
      BucketSize.month,
      BucketSize.season,
      BucketSize.week,
      BucketSize.year,
    ]),
    daylightSavings: faker.datatype.boolean(),
    time: [modelData.time(), modelData.time()].join(","),
    date: [modelData.dateTime(), modelData.dateTime()].join(","),
    charts: faker.helpers
      .shuffle([
        Chart.speciesAccumulationCurve,
        Chart.speciesCompositionCurve,
        Chart.falseColorSpectrograms,
        Chart.none,
      ])
      .join(","),
    ...data,
  };
}
