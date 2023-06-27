import { DateTime, Duration } from "luxon";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { Filters } from "@baw-api/baw-api.service";
import { Params } from "@angular/router";
import { EventSummaryReportParameters } from "./EventSummaryReportParameters";

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
    dataModel.timeFinishedBefore = Duration.fromObject({ hours: 22, minutes: 15 });
    dataModel.dateStartedAfter = DateTime.fromISO("2020-02-01T00:00:00.000+00:00");
    dataModel.dateFinishedBefore = DateTime.fromISO("2020-03-01T00:00:00.000+00:00");
    dataModel.recogniserCutOff = 0.5;
    dataModel.charts = ["chart1", "chart2"];

    // splitting these line by parameter allows for easier visualization
    const expectedParameters: string =
      "sites=4,5,6" +
      "&provenances=7,8,9" +
      "&events=10,11,12" +
      "&recogniserCutOff=0.5" +
      "&charts=chart1,chart2" +
      "&binSize=month" +
      "&ignoreDaylightSavings=true" +
      "&timeStartedAfter=01:30" +
      "&timeFinishedBefore=22:15" +
      "&dateStartedAfter=2020-02-01" +
      "&dateFinishedBefore=2020-03-01";

    const realizedParameters = dataModel.toQueryString();

    expect(realizedParameters).toEqual(expectedParameters);
  });

  it("should construct the correct filter when all fields are set", () => {
    const dataModel = new EventSummaryReportParameters();

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

  it("should create correctly from incomplete query string parameters", () => {
    const mockQueryParameters: Params = {
      sites: "4,5,6",
      provenances: "7,8,9",
      events: "10,11,12",
    };
    const dataModel = new EventSummaryReportParameters();
  });

  it("should create correctly using all query string parameters", () => {
  });

  it("should create correctly with additional query string parameters that don't belong to the data model", () => {
  });

  it("should be able to reconstruct the same query string parameters that it was created with", () => {
  });
});
