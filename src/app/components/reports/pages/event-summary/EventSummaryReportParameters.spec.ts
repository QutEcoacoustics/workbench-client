import { EventSummaryReport } from "@models/EventSummaryReport";
import { Filters } from "@baw-api/baw-api.service";
import { Params } from "@angular/router";
import { Chart, EventSummaryReportParameters } from "./EventSummaryReportParameters";

describe("EventSummaryReportParameters", () => {
  // as this is a component specific data model, it's not generalized in the model fakes
  it("should create", () => {
    const dataModel = new EventSummaryReportParameters();
    expect(dataModel).toBeInstanceOf(EventSummaryReportParameters);
  });

  // if this test is failing, it might be because dates are being emitted with a local timezone
  it("should construct the correct filter when all fields are set", () => {
    const mockQueryParameters: Params = {
      time: "01:30,22:15",
      date: "2020-02-01,2020-03-01",
      daylightSavings: "true",
      sites: "4,5,6",
      points: "7,8,9",
      provenances: "11,23,2",
      tags: "10,11,12",
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

    expect(JSON.stringify(realizedFilter)).toEqual(JSON.stringify(expectedFilter));
  });

  it("should create correctly from incomplete query string parameters", () => {
    const mockQueryParameters: Params = {
      sites: "41,52,46",
      score: "0.5",
      charts: Chart.falseColorSpectrograms,
      daylightSavings: "true",
    };

    const dataModel = new EventSummaryReportParameters(mockQueryParameters);

    // because we are using the @bawCollection decorator, all the sites should be converted to sets
    expect(dataModel.sites).toEqual([41, 52, 46]);
    expect(dataModel.score).toEqual(0.5);
    expect(dataModel.charts).toEqual([Chart.falseColorSpectrograms]);
    expect(dataModel.daylightSavings).toEqual(true);
  });

  it("should create correctly using all query string parameters", () => {
    const mockQueryParameters: Params = {
      sites: "4,5,6",
      points: "7,8,9",
      provenances: "11,23,2",
      tags: "10,11,12",
      score: "0.5",
      charts: "composition,accumulation",
      bucketSize: "month",
      daylightSavings: "true",
    };

    const dataModel = new EventSummaryReportParameters(mockQueryParameters);

    expect(dataModel.sites).toEqual([4, 5, 6]);
    expect(dataModel.points).toEqual([7, 8, 9]);
    expect(dataModel.provenances).toEqual([11, 23, 2]);
    expect(dataModel.tags).toEqual([10, 11, 12]);
    expect(dataModel.score).toEqual(0.5);
    expect(dataModel.charts).toEqual([Chart.speciesCompositionCurve, Chart.speciesAccumulationCurve]);
    expect(dataModel.bucketSize).toEqual("month");
    expect(dataModel.daylightSavings).toEqual(true);
  });

  it("should create correctly with additional query string parameters that don't belong to the data model", () => {
    const mockQueryParameters: Params = {
      sites: "4,5,6",
      redirect: "false", // this is not a part of the data model
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
});
