import { modelData } from "@test/helpers/faker";
import { Project } from "@models/Project";
import { Filters, Sorting } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { Params } from "@angular/router";
import { DateTime } from "luxon";
import { generateAnnotationSearchUrlParameters } from "@test/fakes/data/AnnotationSearchParameters";
import { AnnotationSearchParameters } from "./annotationSearchParameters";

interface SearchParameterTest {
  name: string;
  inputParams: Params;
  expectedFilters: () => Filters<AudioEvent>;
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

  const defaultSorting: Sorting<keyof AudioEvent> = {
    orderBy: "createdAt",
    direction: "asc",
  };

  const testCases: SearchParameterTest[] = [
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
    },
  ];

  for (const test of testCases) {
    it(test.name, () => {
      const dataModel = createParameterModel(test.inputParams);
      expect(dataModel.toFilter()).toEqual(test.expectedFilters());
    });
  }

  describe("sampling", () => {
    // These tests only assert that the correct filter conditions can be created
    // for the following conditions.
    // Asserting that the user model can be successfully resolved and assigned
    // is tested in the annotation search form and other consumers.
    it("should have the correct default sampling when logged in", () => {
      const dataModel = new AnnotationSearchParameters(
        generateAnnotationSearchUrlParameters(),
      );

      // Because the user id cannot be instantiated through the query string
      // parameters, we have to manually assign it.

      const expectedFilters = {};
      const realizedFilters = {};
    });

    it("should correctly update default filters if the user logs out", () => {});
  });
});
