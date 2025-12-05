import { Params } from "@angular/router";
import { Filters, Sorting } from "@baw-api/baw-api.service";
import { AudioEvent } from "@models/AudioEvent";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { DateTime } from "luxon";
import { AnnotationSearchParameters } from "./annotationSearchParameters";

interface SearchParameterTest {
  name: string;
  inputParams: Params;
  expectedFilters: () => Filters<AudioEvent>;
}

describe("annotationSearchParameters", () => {
  let routeProject: Project;
  let mockUser: User;

  it("should create", () => {
    const dataModel = new AnnotationSearchParameters();
    expect(dataModel).toBeInstanceOf(AnnotationSearchParameters);
  });

  // If the user is un-authenticated, they should see all unverified events
  // because the default for logged in users (show all that the user hasn't
  // verified) cannot be performed for a logged in user.
  xit("should have the correct default filters for an unauthenticated user", () => {
    const dataModel = new AnnotationSearchParameters();

    const expectedFilters = {
      filter: {
        and: [{ "sites.id": { in: [] } }, { "verifications.id": { eq: null } }],
      },
      sorting: {
        orderBy: "createdAt",
        direction: "asc",
      },
    } as any;
    const realizedFilters = dataModel.toFilter();

    expect(realizedFilters).toEqual(expectedFilters);
  });

  // Because the import files are expected to be a subset of the annotation
  // imports, we should always see both parameters or neither.
  // If there is only an annotation import file parameter, this indicates that
  // something has gone wrong, and we should delete the file parameter.
  // We delete the parameter instead of silently ignoring it so that the user
  // gets some feedback that the parameter was ignored because the url will
  // change with the file parameter removed.
  it("should remove annotation import file parameters if there are no annotation import parameters", () => {
    const params: Params = {
      importFiles: "1,2,3",
    };

    const dataModel = new AnnotationSearchParameters(
      params,
      new User(generateUser()),
    );

    expect("importFiles" in dataModel.toQueryParams()).toBeFalse();
  });

  function createParameterModel(params?: Params): AnnotationSearchParameters {
    mockUser = new User(generateUser({ id: 42 }));
    const dataModel = new AnnotationSearchParameters(params, mockUser);

    const mockProjectId = modelData.id();
    dataModel.routeProjectId = mockProjectId;

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

  const myUnverifiedFilters = {
    or: [
      { "verifications.creatorId": { notEq: 42 } },
      { "verifications.id": { eq: null } },
      {
        and: [
          { "verifications.creatorId": { eq: 42 } },
          { "verifications.confirmed": { eq: "skip" } },
        ],
      },
    ],
  };

  const testCases: SearchParameterTest[] = [
    {
      name: "should create correct default filters for an authenticated user",
      inputParams: undefined,
      expectedFilters: () => ({
        filter: {
          "projects.id": {
            in: [routeProject.id],
          },
        } as any,
        sorting: defaultSorting,
      }),
    },
    {
      name: "should create correct filter when filters are set",
      inputParams: {
        audioRecordings: "11,12,13",
        tags: "4,5,6",
        imports: "42:1,42:2,42:3,67:",
        recordingDate: ",2020-03-01",
        score: "0.5,0.9",

        regions: "2,3,4,5",
        sites: "6,7,8,9",

        taskTag: "5",
        verificationStatus: "unverified-for-me",
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
            {
              or: [
                { audioEventImportFileId: { in: [1, 2, 3] } },
                { "audioEventImports.id": { eq: 67 } },
              ],
            },
            {
              "sites.id": {
                in: [6, 7, 8, 9],
              },
            },
            { score: { gteq: 0.5 } },
            { score: { lteq: 0.9 } },
            myUnverifiedFilters,
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

        taskTag: "4",
        verificationStatus: "unverified",
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
            { "sites.id": { in: [6, 7, 8, 9] } },
            { score: { gteq: 0.5 } },
            { score: { lteq: 0.9 } },
            {
              or: [
                { "verifications.confirmed": { eq: null } },
                { "verifications.confirmed": { eq: "skip" } },
              ],
            },
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
              "projects.id": {
                in: [routeProject.id],
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
              "projects.id": {
                in: [routeProject.id],
              },
            },
            { score: { lteq: 0.9 } },
          ],
        },
        sorting: defaultSorting,
      }),
    },
    {
      name: "should have the correct filters for only a verification status filter",
      inputParams: {
        verificationStatus: "unverified",
      },
      expectedFilters: () => ({
        filter: {
          and: [
            {
              "projects.id": {
                in: [routeProject.id],
              },
            },
            {
              or: [
                { "verifications.confirmed": { eq: null } },
                { "verifications.confirmed": { eq: "skip" } },
              ],
            },
          ],
        },
        sorting: defaultSorting,
      }),
    },
    {
      name: "should create correct filter when event imports are set",
      inputParams: {
        imports: "1:,2:,3:",
      },
      expectedFilters: () => ({
        filter: {
          and: [
            {
              or: [
                { "audioEventImports.id": { eq: 1 } },
                { "audioEventImports.id": { eq: 2 } },
                { "audioEventImports.id": { eq: 3 } },
              ],
            },
            {
              "projects.id": {
                in: [routeProject.id],
              },
            },
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
});
