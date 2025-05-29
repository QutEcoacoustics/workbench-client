import { modelData } from "@test/helpers/faker";
import { Project } from "@models/Project";
import { Filters } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { Params } from "@angular/router";
import { DateTime } from "luxon";
import { AnnotationSearchParameters } from "./annotationSearchParameters";

function addRouteModels(
  dataModel: AnnotationSearchParameters,
): AnnotationSearchParameters {
  const mockProjectId = modelData.id();
  dataModel.routeProjectId = modelData.id();

  const mockSiteIds = modelData.ids();
  dataModel.routeProjectModel = new Project({
    id: mockProjectId,
    siteIds: mockSiteIds,
  });

  return dataModel;
}

describe("annotationSearchParameters", () => {
  it("should create", () => {
    const dataModel = new AnnotationSearchParameters();
    expect(dataModel).toBeInstanceOf(AnnotationSearchParameters);
  });

  it("should create correct default filters", () => {
    const dataModel = addRouteModels(new AnnotationSearchParameters());

    const expectedFilters = {
      filter: {
        "audioRecordings.siteId": {
          in: Array.from(dataModel.routeProjectModel.siteIds),
        },
      },
    } as Filters<AudioEvent>;

    expect(dataModel.toFilter()).toEqual(expectedFilters);
  });

  fit("should create correct filter condition when filters is set", () => {
    const mockQueryParameters: Params = {
      audioRecordings: "11,12,13",
      tags: "4,5,6",
      recordingDate: ",2020-03-01",

      regions: "2,3,4,5",
      sites: "6,7,8,9",
    };

    const dataModel = addRouteModels(
      new AnnotationSearchParameters(mockQueryParameters),
    );

    // Note that there are no sorting parameters in this expected filter.
    // If there are sorting parameters (even empty objects) in your resulting
    // filters, something has gone wrong.
    const expectedFilters = {
      filter: {
        and: [
          { "tags.id": { in: [4, 5, 6] } },
          {
            "audioRecordings.recordedDate": {
              lessThan: DateTime.fromISO("2020-03-01T00:00:00.000Z", { zone: "utc" })
            }
          },
          {
            "audioRecordings.siteId": {
              in: Array.from(dataModel.routeProjectModel.siteIds),
            },
          },
        ],
      },
    } as Filters<AudioEvent>;

    expect(dataModel.toFilter()).toEqual(expectedFilters);
  });

  it("should create correct filter condition when both filters and sorting is set", () => {
    const mockQueryParameters: Params = {
      audioRecordings: "11,12,13",
      tags: "4,5,6",
      recordingDate: ",2020-03-01",

      regions: "2,3,4,5",
      sites: "6,7,8,9",

      sortBy: "score-asc",
    };

    const expectedFilters = {
      filter: {
        "audioRecordings.id": {
          in: [11, 12, 13],
        },
        "tags.id": {
          in: [4, 5, 6],
        },
        recordedDate: {
          lessThan: {
            expressions: ["local_offset", "time_of_day"],
            value: "22:15",
          },
        },
        "regions.id": {
          in: [2, 3, 4, 5],
        },
        "sites.id": {
          in: [6, 7, 8, 9],
        },
      },
      sorting: {
        orderBy: "score",
        direction: "asc",
      },
    } as Filters<AudioEvent>;

    const dataModel = addRouteModels(
      new AnnotationSearchParameters(mockQueryParameters),
    );

    expect(dataModel.toFilter()).toEqual(expectedFilters);
  });
});
