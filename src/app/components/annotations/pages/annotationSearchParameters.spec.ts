import { modelData } from "@test/helpers/faker";
import { Project } from "@models/Project";
import { Filters } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { Params } from "@angular/router";
import { DateTime } from "luxon";
import { AnnotationSearchParameters } from "./annotationSearchParameters";

interface SearchParamtersTest {
  name: string;
  inputParams: Params;
  expectedFitlers: () => Filters<AudioEvent>;
}

describe("annotationSearchParameters", () => {
  let routeProject: Project;

  it("should create", () => {
    const dataModel = new AnnotationSearchParameters();
    expect(dataModel).toBeInstanceOf(AnnotationSearchParameters);
  });

  function createParameterModel(params?: Params): AnnotationSearchParameters {
    const dataModel = new AnnotationSearchParameters(params);

    const mockProjectId = modelData.id();
    dataModel.routeProjectId = modelData.id();

    const mockSiteIds = modelData.ids();
    routeProject = new Project({
      id: mockProjectId,
      siteIds: mockSiteIds,
    });

    dataModel.routeProjectModel = routeProject;

    return dataModel;
  }

  const testCases: SearchParamtersTest[] = [
    {
      name: "should create correct default filters",
      inputParams: undefined,
      expectedFitlers: () => ({
        filter: {
          "audioRecordings.siteId": {
            in: Array.from(routeProject.siteIds),
          },
        },
        sorting: {
          orderBy: "createdAt",
          direction: "asc",
        },
      } as Filters<AudioEvent>),
    },
    {
      name: "should create correct filter condition when filters is set",
      inputParams: {
        audioRecordings: "11,12,13",
        tags: "4,5,6",
        recordingDate: ",2020-03-01",
        score: 0.5,

        regions: "2,3,4,5",
        sites: "6,7,8,9",
      },
      expectedFitlers: () => ({
        filter: {
          and: [
            { "tags.id": { in: [4, 5, 6] } },
            {
              "audioRecordings.recordedDate": {
                lessThan: DateTime.fromISO("2020-03-01T00:00:00.000Z", { zone: "utc" })
              }
            },
            { "audioRecordings.id": { in: [11, 12, 13] } },
            {
              "audioRecordings.siteId": {
                in: [6, 7, 8, 9],
              },
            },
          ],
        },
        sorting: {
          orderBy: "createdAt",
          direction: "asc",
        },
      }),
    },
    {
      name: "should create correct filter condition when both filters and sorting is set",
      inputParams: {
        audioRecordings: "11,12,13",
        tags: "4,5,6",
        recordingDate: ",2020-03-01",

        regions: "2,3,4,5",
        sites: "6,7,8,9",

        sort: "score-asc",
      },
      expectedFitlers: () => ({
        filter: {
          and: [
            { "tags.id": { in: [4, 5, 6] } },
            {
              "audioRecordings.recordedDate": {
                lessThan: jasmine.any(DateTime),
              },
            },
            { "audioRecordings.id": { in: [11, 12, 13] } },
            { "audioRecordings.siteId": { in: [6, 7, 8, 9] } },
          ],
        },
        sorting: {
          orderBy: "score",
          direction: "asc",
        },
      }),
    },
  ];

  for (const test of testCases) {
    it(test.name, () => {
      const dataModel = createParameterModel(test.inputParams);
      expect(dataModel.toFilter()).toEqual(test.expectedFitlers());
    });
  }
});
