import { Verification } from "@models/Verification";
import { generateVerification } from "@test/fakes/Verification";
import { modelData } from "@test/helpers/faker";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import {
  mockServiceImports,
  mockServiceProviders,
  validateReadonlyApi,
  validateStandardApi,
} from "@test/helpers/api-common";
import { IdOr } from "@baw-api/api-common";
import { AudioRecording } from "@models/AudioRecording";
import { AudioEvent } from "@models/AudioEvent";
import { User } from "@models/User";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateUser } from "@test/fakes/User";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { CONFLICT, INTERNAL_SERVER_ERROR } from "http-status";
import { catchError, firstValueFrom, of, throwError } from "rxjs";
import { ShallowVerificationService, VerificationService } from "./verification.service";

type Model = Verification;

type Params = [IdOr<AudioRecording>, IdOr<AudioEvent>];
type Service = VerificationService;

type ShallowParams = [];
type ShallowService = ShallowVerificationService;

describe("VerificationService", () => {
  const testModelId = modelData.id();
  const testAudioRecordingId = modelData.id();
  const testAudioEventId = modelData.id();
  const createModel = () =>
    new Verification(
      generateVerification({
        id: testModelId,
        audioEventId: testAudioEventId,
      }),
    );

  const baseUrl = `/audio_recordings/${testAudioRecordingId}/audio_events/${testAudioEventId}/verifications/`;
  const updateUrl: string = baseUrl + testModelId;
  let spec: SpectatorService<VerificationService>;

  const createService = createServiceFactory({
    service: VerificationService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateReadonlyApi<Model, Params, Service>(
    () => spec,
    Verification,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    testModelId,
    testAudioRecordingId,
    testAudioEventId,
  );
});

describe("ShallowVerificationService", () => {
  const testModelId = modelData.id();
  const createModel = () => new Verification(generateVerification({ id: testModelId }));
  const baseUrl = "/verifications/";
  const updateUrl: string = baseUrl + testModelId;
  let spec: SpectatorService<ShallowVerificationService>;

  const createService = createServiceFactory({
    service: ShallowVerificationService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach(() => {
    spec = createService();
  });

  validateStandardApi<Model, ShallowParams, ShallowService>(
    () => spec,
    Verification,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    testModelId,
  );

  describe("custom methods", () => {
    let mockModel: Model;
    let mockAudioEvent: AudioEvent;
    let mockUser: User;
    let api: BawApiService<Model>;

    let mockFilterResponse: Verification[] | BawApiError<any>;
    let mockCreateResponse: Verification | BawApiError<any>;
    let mockUpdateResponse: Verification | BawApiError<any>;

    beforeEach(() => {
      mockModel = createModel();
      mockAudioEvent = new AudioEvent(generateAudioEvent({ id: mockModel.audioEventId }));
      mockUser = new User(generateUser({ id: mockModel.creatorId }));

      mockCreateResponse = createModel();
      mockUpdateResponse = createModel();
      mockFilterResponse = modelData.randomArray(1, 10, () => createModel());

      api = spec.inject<BawApiService<Model>>(BawApiService);

      spyOn(api, "create").and.callFake(() =>
        mockCreateResponse instanceof BawApiError ? throwError(() => mockCreateResponse) : of(mockCreateResponse),
      );

      spyOn(api, "update").and.callFake(() =>
        mockUpdateResponse instanceof BawApiError ? throwError(() => mockUpdateResponse) : of(mockUpdateResponse),
      );

      spyOn(api, "filter").and.callFake(() =>
        mockFilterResponse instanceof BawApiError ? throwError(() => mockFilterResponse) : of(mockFilterResponse),
      );
    });

    describe("audioEventUserVerification", () => {
      it("should call the filter api with the correct data", () => {
        const expectedFilters = {
          filter: {
            and: [{ audioEventId: { eq: mockAudioEvent.id } }, { creatorId: { eq: mockUser.id } }],
          },
          paging: {
            items: 1,
          },
        } as const satisfies Filters<Verification>;

        spec.service.audioEventUserVerification(mockAudioEvent, mockUser);

        expect(api.filter).toHaveBeenCalledOnceWith(Verification, jasmine.anything(), expectedFilters);
      });

      it("should return the verification if the audio event is verified", async () => {
        const response = await firstValueFrom(spec.service.audioEventUserVerification(mockAudioEvent, mockUser));

        expect(response).toEqual(mockFilterResponse[0]);
      });

      it("should return null if the audio event is not verified", async () => {
        mockFilterResponse = [];

        const response = await firstValueFrom(spec.service.audioEventUserVerification(mockAudioEvent, mockUser));

        expect(response).toBeNull();
      });
    });

    describe("createOrUpdate", () => {
      it("should emit a create request if the verification does not exist", () => {
        spec.service.createOrUpdate(mockModel, mockAudioEvent, mockUser).subscribe();
        expect(api.create).toHaveBeenCalledTimes(1);
      });

      it("should emit an update request if there is a verification conflict", async () => {
        mockCreateResponse = new BawApiError<Verification>(CONFLICT, "Conflict", null);

        const response = await firstValueFrom(spec.service.createOrUpdate(mockModel, mockAudioEvent, mockUser));

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.update).toHaveBeenCalledTimes(1);

        expect(response).toEqual(mockUpdateResponse as any);
      });

      it("should not emit an update request if there is an internal server error", async () => {
        mockCreateResponse = new BawApiError<Verification>(INTERNAL_SERVER_ERROR, "Internal Server Error", null);

        const response = await firstValueFrom(
          spec.service.createOrUpdate(mockModel, mockAudioEvent, mockUser).pipe(catchError(() => of(null))),
        );

        expect(api.create).toHaveBeenCalledTimes(1);
        expect(api.update).toHaveBeenCalledTimes(0);

        expect(response).toBeNull();
      });
    });
  });
});
