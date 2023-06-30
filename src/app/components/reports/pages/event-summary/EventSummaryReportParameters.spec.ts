import { DateTime, Duration } from "luxon";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { Filters } from "@baw-api/baw-api.service";
import { Params } from "@angular/router";
import {
  EventSummaryReportParameters,
  ChartType,
} from "./EventSummaryReportParameters";

describe("EventSummaryReportParameters", () => {
  // as this is a component specific data model, it's not generalized in the model fakes
  it("should create", () => {
    const dataModel = new EventSummaryReportParameters();
    expect(dataModel).toBeInstanceOf(EventSummaryReportParameters);
  });

  it("should construct the correct query string parameters when all fields are set", () => {
    const dataModel = new EventSummaryReportParameters();

    dataModel.sites = [4, 5, 6];
    dataModel.provenances = [7, 8, 9];
    dataModel.events = [10, 11, 12];
    dataModel.timeStartedAfter = Duration.fromObject({ hours: 1, minutes: 30 });
    dataModel.timeFinishedBefore = Duration.fromObject({
      hours: 22,
      minutes: 15,
    });
    dataModel.dateStartedAfter = DateTime.fromISO(
      "2020-02-01T00:00:00.000+00:00"
    );
    dataModel.dateFinishedBefore = DateTime.fromISO(
      "2020-03-01T00:00:00.000+00:00"
    );
    dataModel.score = 0.5;
    dataModel.charts = ["chart1", "chart2"];

    // splitting these line by parameter allows for easier visualization
    const expectedParameters: string =
      "score=0.5" +
      "&bucketSize=month" +
      "&daylightSavings=true" +
      "&sites=4,5,6" +
      "&provenances=7,8,9" +
      "&events=10,11,12" +
      "&timeStartedAfter=01:30" +
      "&timeFinishedBefore=22:15" +
      "&dateStartedAfter=2020-02-01" +
      "&dateFinishedBefore=2020-03-01" +
      "&charts=chart1,chart2";

    const realizedParameters = dataModel.toHttpParams();

    expect(realizedParameters).toEqual(expectedParameters);
  });

  // if this test is failing, it might be because dates are being emitted with a local timezone
  it("should construct the correct filter when all fields are set", () => {
    const mockQueryParameters: Params = {
      timeStartedAfter: "01:30",
      timeFinishedBefore: "22:15",
      dateStartedAfter: "2020-02-01",
      dateFinishedBefore: "2020-03-01",
      daylightSavings: "true",
      sites: "4,5,6",
      points: "7,8,9",
      provenances: "11,23,2",
      events: "10,11,12",
      score: "0.5",
      charts: "chart1,chart2",
      bucketSize: "month",
    };

    const dataModel = new EventSummaryReportParameters(mockQueryParameters);

    const expectedFilter: Filters<EventSummaryReport> = {
      filter: {
        and: [
          // since filter conditions are in the casing required by the API (not camel case)
          // typescript will throw a linting error here. As this is the expected behavior, we can disable this convention for these lines
          /* eslint-disable @typescript-eslint/naming-convention */
          { "region.id": { in: [4, 5, 6] } },
          { "site.id": { in: [7, 8, 9] } },
          { "provenance.id": { in: [11, 23, 2] } },
          { "tag.id": { in: [10, 11, 12] } },
          { score: { gteq: 0.5 } },
          { bucketSize: { eq: "month" } },
          { recordedEndDate: { greaterThan: "2020-02-01T00:00:00.000Z" } },
          { recordedDate: { lessThan: "2020-03-01T00:00:00.000Z" } },
          {
            recordedEndDate: {
              greaterThan: {
                expressions: ["local_offset", "time_of_day"],
                value: "01:30",
              },
            },
          },
          {
            recordedDate: {
              lessThan: {
                expressions: ["local_offset", "time_of_day"],
                value: "22:15",
              },
            },
          },
          /* eslint-enable @typescript-eslint/naming-convention */
        ],
      },
    };

    const realizedFilter: Filters<EventSummaryReport> = dataModel.toFilter();

    expect(JSON.stringify(realizedFilter)).toEqual(
      JSON.stringify(expectedFilter)
    );
  });

  it("should create correctly from incomplete query string parameters", () => {
    const mockQueryParameters: Params = {
      sites: "41,52,46",
      score: "0.5",
      charts: ChartType.falseColorSpectrograms,
      daylightSavings: "true",
    };

    const dataModel = new EventSummaryReportParameters(mockQueryParameters);

    expect(dataModel.sites).toEqual([41, 52, 46]);
    expect(dataModel.score).toEqual(0.5);
    expect(dataModel.charts).toEqual(["False Colour Spectrograms"]);
    expect(dataModel.daylightSavings).toEqual(true);
  });

  it("should create correctly using all query string parameters", () => {
    const mockQueryParameters: Params = {
      sites: "4,5,6",
      points: "7,8,9",
      provenances: "11,23,2",
      events: "10,11,12",
      score: "0.5",
      charts: "chart1,chart2",
      bucketSize: "month",
      daylightSavings: "true",
    };

    const dataModel = new EventSummaryReportParameters(mockQueryParameters);

    expect(dataModel.sites).toEqual([4, 5, 6]);
    expect(dataModel.points).toEqual([7, 8, 9]);
    expect(dataModel.provenances).toEqual([11, 23, 2]);
    expect(dataModel.events).toEqual([10, 11, 12]);
    expect(dataModel.score).toEqual(0.5);
    expect(dataModel.charts).toEqual(["chart1", "chart2"]);
    expect(dataModel.bucketSize).toEqual("month");
    expect(dataModel.daylightSavings).toEqual(true);
  });

  it("should create correctly with additional query string parameters that don't belong to the data model", () => {
    const mockQueryParameters: Params = {
      time: "11:11", // this is not a part of the data model
      sites: "4,5,6",
      daylightSavings: "true",
      error: "true", // this is not a part of the data model
    };

    const dataModel = new EventSummaryReportParameters(mockQueryParameters);

    expect(dataModel.sites).toEqual([4, 5, 6]);
    expect(dataModel.daylightSavings).toEqual(true);

    // we have to use manual access because these fields are not and should not be a part of the class structure
    expect(dataModel["time"]).toBeUndefined();
    expect(dataModel["error"]).toBeUndefined();
  });

  it("should be able to reconstruct the same query string parameters that it was created with", () => {
    const mockQueryString: string =
      "score=0.995" +
      "&bucketSize=season" +
      "&daylightSavings=false" +
      "&sites=4,5,6" +
      "&points=7,8,9" +
      "&provenances=11,23,2" +
      "&events=10,11,12" +
      "&charts=Species%20Composition%20Curve,False%20Colour%20Spectrogram,Species%20Accumulation%20Curve";

    const mockSearchParameters: Params = {
      sites: "4,5,6",
      points: "7,8,9",
      provenances: "11,23,2",
      events: "10,11,12",
      score: "0.995",
      charts:
        "Species Composition Curve,False Colour Spectrogram,Species Accumulation Curve",
      bucketSize: "season",
      daylightSavings: "false",
    };

    const dataModel = new EventSummaryReportParameters(mockSearchParameters);

    const realizedParameters = dataModel.toHttpParams();

    expect(realizedParameters).toEqual(mockQueryString);
  });
});
