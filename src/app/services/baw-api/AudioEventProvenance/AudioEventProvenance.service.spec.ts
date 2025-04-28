import { Id } from "@interfaces/apiInterfaces";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { AudioEventProvenanceService } from "./AudioEventProvenance.service";

// TODO: enable once the api is complete
// this is currently disabled because it will fail due to us mocking the service
// this causes the test to fail because we are not calling the BawApiService injected service
// however, this test does complete if we remove the comments from the service, however, this will cause 404 errors
// if a user tries to use the service through the web page
xdescribe("AudioEventProvenanceService", () => {
  const modelId: Id = 5;
  const createModel = () =>
    new AudioEventProvenance(generateAudioEventProvenance({ id: modelId }));

  const baseUrl = "/provenance/";
  const updateUrl: string = baseUrl + modelId;
  let spectator: SpectatorService<AudioEventProvenanceService>;

  const createService = createServiceFactory({
    service: AudioEventProvenanceService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spectator = createService();
  });

  validateStandardApi(
    () => spectator,
    AudioEventProvenance,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    modelId
  );
});
