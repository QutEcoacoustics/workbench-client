import { DateTime, Duration } from "luxon";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { Filters } from "@baw-api/baw-api.service";
import { EventSummaryReportParameters } from "./EventSummaryReportParameters";

describe("EventSummaryReportParameters", () => {
  const fakeDuration = Duration.fromObject({
    years: 1,
    months: 2,
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 6,
    milliseconds: 7,
  });

  // as this is a component specific data model, it's not generalized in the model fakes
  it("should create", () => {
    const dataModel = new EventSummaryReportParameters();
    expect(dataModel).toBeInstanceOf(EventSummaryReportParameters);
  });

  it("should construct the correct query string parameters when all fields are set", () => {
    const dataModel = new EventSummaryReportParameters(
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
      0.5,
      ["chart1", "chart2"],
      fakeDuration,
      fakeDuration,
      DateTime.fromJSDate(new Date(2020, 1, 1)),
      DateTime.fromJSDate(new Date(2020, 2, 1))
    );

    // splitting these line by parameter allows for easier visualization
    const expectedParameters: string =
      "sites=4,5,6" +
      "&provenances=7,8,9" +
      "&events=10,11,12" +
      "&timeStartedAfter=P1Y2M3DT4H5M6.007S" +
      "&timeFinishedBefore=P1Y2M3DT4H5M6.007S" +
      "&dateStartedAfter=2020-02-01T00:00:00.000%2B10:00" +
      "&dateFinishedBefore=2020-03-01T00:00:00.000%2B10:00" +
      "&provenanceCutOff=0.5&charts=chart1,chart2"

    const realizedParameters = dataModel.toQueryString();

    expect(realizedParameters).toEqual(expectedParameters);
  });

  it("should construct the correct filter when all fields are set", () => {
    const dataModel = new EventSummaryReportParameters(
      [11, 12, 3],
      [151, 23, 16],
      [72, 82, 99],
      [1123404, 121, 112],
      0.98,
      ["species accumulation curve"],
      fakeDuration,
      fakeDuration,
      DateTime.fromJSDate(new Date(2020, 9, 7)),
      DateTime.fromJSDate(new Date(2022, 12, 5))
    );

    const expectedFilter: Filters<EventSummaryReport> = {
      filter: {
        and: [
          // since filter conditions are in the casing required by the API (not camel case)
          // typescript will throw a linting error here. As this is the expected behavior, we can disable this convention for these lines
          /* eslint-disable @typescript-eslint/naming-convention */
          { "region.id": { in: [151, 23, 16] } },
          { "provenance.id": { in: [72, 82, 99] } },
          { "tag.id": { in: [1123404, 121, 112] } },
          /* eslint-enable @typescript-eslint/naming-convention */
        ],
      },
    };
    const realizedFilter: Filters<EventSummaryReport> = dataModel.toFilter();

    expect(realizedFilter).toEqual(expectedFilter);
  });
});
