import { IdOr } from "@baw-api/api-common";
import { InnerFilter } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import {
  mockServiceProviders,
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";

interface ProjectForTest {
  model: Parameters<ProjectsService["getProjectFor"]>[0];
  expectedFilters: InnerFilter;
}

describe("ProjectsService", (): void => {
  const createModel = () => new Project(generateProject({ id: 5 }));
  const baseUrl = "/projects/";
  const updateUrl = baseUrl + "5";
  let spec: SpectatorService<ProjectsService>;

  const createService = createServiceFactory({
    service: ProjectsService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
  });

  validateStandardApi(
    () => spec,
    Project,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    5
  );

  validateCustomApiFilter<Project, [IdOr<User>], ProjectsService>(
    () => spec,
    Project,
    baseUrl + "filter",
    "filterByCreator",
    { filter: { creatorId: { eq: 5 } } },
    undefined,
    5
  );

  describe("getProjectFor", () => {
    // We have to use "as any" here because inner filters do not support typing
    // for associated models.
    // see: https://github.com/QutEcoacoustics/workbench-client/issues/1777
    const testCases: ProjectForTest[] = [
      {
        model: new Site(generateSite({ id: 3 })),
        expectedFilters: {
          "sites.id": { in: [3] },
        } as any,
      },
      {
        model: new Region(generateRegion({ siteIds: [1,2,3] })),
        expectedFilters: {
          "sites.id": { in: [1,2,3] },
        } as any,
      },
      {
        model: new AudioRecording(generateAudioRecording({
          siteId: 42,
        })),
        expectedFilters: {
          "sites.id": { in: [42] },
        } as any,
      },
    ];

    for (const testCase of testCases) {
      it(`should make the correct filter request for a ${testCase.model.kind} model`, () => {
        const filterApi = spyOn(spec.service, "filter").and.stub();

        spec.service.getProjectFor(testCase.model);

        expect(filterApi).toHaveBeenCalledOnceWith({
          filter: testCase.expectedFilters,
        });
      });
    }
  });
});
