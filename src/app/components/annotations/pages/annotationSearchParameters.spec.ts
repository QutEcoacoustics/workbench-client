import { modelData } from "@test/helpers/faker";
import { Project } from "@models/Project";
import { Filters, Sorting } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { Params } from "@angular/router";
import { DateTime } from "luxon";
import { AnnotationSearchParameters } from "./annotationSearchParameters";

interface SearchParamtersTest {
  name: string;
  inputParams: Params;
  expectedFilters: () => Filters<AudioEvent>;
  expectedWithoutProject?: () => Filters<AudioEvent>;
}

describe("annotationSearchParameters", () => {
  let routeProject: Project;

  it("should create", () => {
    const dataModel = new AnnotationSearchParameters();
    expect(dataModel).toBeInstanceOf(AnnotationSearchParameters);
  });

  function createParameterModel(
    params?: Params,
    withProject = true,
  ): AnnotationSearchParameters {
    const dataModel = new AnnotationSearchParameters(params);

    if (withProject) {
      const mockProjectId = modelData.id();
      dataModel.routeProjectId = modelData.id();

      const mockSiteIds = modelData.ids();
      routeProject = new Project({
        id: mockProjectId,
        siteIds: mockSiteIds,
      });

      dataModel.routeProjectModel = routeProject;
    }

    return dataModel;
  }

  const defaultSorting: Sorting<keyof AudioEvent> = {
    orderBy: "createdAt",
    direction: "asc",
  };

  const testCases: SearchParamtersTest[] = [
    {
      name: "should create correct default filters",
      inputParams: undefined,
      expectedFilters: () =>
        ({
          filter: {
            "audioRecordings.siteId": {
              in: Array.from(routeProject.siteIds),
            },
          },
          sorting: defaultSorting,
        }) as Filters<AudioEvent>,
      expectedWithoutProject: () => ({ sorting: defaultSorting }),
    },
    {
      name: "should create correct filter when filters is set",
      inputParams: {
        audioRecordings: "11,12,13",
        tags: "4,5,6",
        importFiles: "1,12,23",
        recordingDate: ",2020-03-01",
        score: "0.5,0.9",

        regions: "2,3,4,5",
        sites: "6,7,8,9",
      },
      expectedFilters: () => ({
        filter: {
          and: [
            { "tags.id": { in: [4, 5, 6] } },
            {
              "audioRecordings.recordedDate": {
                lessThan: DateTime.fromISO("2020-03-01T00:00:00.000Z", {
                  zone: "utc",
                }),
              },
            },
            { "audioRecordings.id": { in: [11, 12, 13] } },
            { audioEventImportFileId: { in: [1, 12, 23] } },
            {
              "audioRecordings.siteId": {
                in: [6, 7, 8, 9],
              },
            },
            { score: { gteq: 0.5 } },
            { score: { lteq: 0.9 } },
          ],
        },
        sorting: defaultSorting,
      }),
    },
    {
      name: "should create correct filter when both filters and sorting is set",
      inputParams: {
        audioRecordings: "11,12,13",
        tags: "4,5,6",
        recordingDate: ",2020-03-01",
        score: "0.5,0.9",

        regions: "2,3,4,5",
        sites: "6,7,8,9",

        sort: "score-asc",
      },
      expectedFilters: () => ({
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
            { score: { gteq: 0.5 } },
            { score: { lteq: 0.9 } },
          ],
        },
        sorting: {
          orderBy: "score",
          direction: "asc",
        },
      }),
    },
    {
      name: "should create correct filter for only lower score range",
      inputParams: {
        score: "0.2,",
      },
      expectedFilters: () => ({
        filter: {
          and: [
            {
              "audioRecordings.siteId": {
                in: Array.from(routeProject.siteIds),
              },
            },
            { score: { gteq: 0.2 } },
          ],
        },
        sorting: defaultSorting,
      }),
      expectedWithoutProject: () => ({
        filter: {
          score: { gteq: 0.2 },
        },
        sorting: defaultSorting,
      }),
    },
    {
      name: "should create correct filter for only a upper score range",
      inputParams: {
        score: ",0.9",
      },
      expectedFilters: () => ({
        filter: {
          and: [
            {
              "audioRecordings.siteId": {
                in: Array.from(routeProject.siteIds),
              },
            },
            { score: { lteq: 0.9 } },
          ],
        },
        sorting: defaultSorting,
      }),
      expectedWithoutProject: () => ({
        filter: {
          score: { lteq: 0.9 },
        },
        sorting: defaultSorting,
      }),
    },
  ];

  for (const test of testCases) {
    it(`${test.name} (with project)`, () => {
      const dataModel = createParameterModel(test.inputParams);
      expect(dataModel.toFilter()).toEqual(test.expectedFilters());
    });

    it(`${test.name} (without project)`, () => {
      const dataModel = createParameterModel(test.inputParams, false);

      // Some tests have the same expected filter regardless of if there is a
      // route project.
      // To reduce boilerplate and repeated definitions, we allow the
      // expectedWithoutProject spec definition to be blank, and we will use the
      // same expectedFilters definition.
      const expectedFilter = test.expectedWithoutProject
        ? test.expectedWithoutProject()
        : test.expectedFilters();

      expect(dataModel.toFilter()).toEqual(expectedFilter);
    });
  }
});
