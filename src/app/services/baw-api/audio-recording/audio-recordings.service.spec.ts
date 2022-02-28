import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { BawSessionService } from "@baw-api/baw-session.service";
import { toBase64Url } from "@helpers/encoding/encoding";
import { AuthToken } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import {
  createServiceFactory,
  SpectatorService,
  SpyObject,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import {
  validateCustomApiFilter,
  validateReadonlyApi,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { AudioRecordingsService } from "./audio-recordings.service";

type Model = AudioRecording;
type Service = AudioRecordingsService;

describe("AudioRecordingsService", function () {
  const createModel = () =>
    new AudioRecording(generateAudioRecording({ id: 5 }));
  const baseUrl = "/audio_recordings/";
  let sessionState: SpyObject<BawSessionService>;
  let spec: SpectatorService<AudioRecordingsService>;
  const createService = createServiceFactory({
    service: AudioRecordingsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    spec = createService();
    sessionState = spec.inject(BawSessionService);
  });

  validateReadonlyApi(
    spec,
    AudioRecording,
    baseUrl,
    baseUrl + "filter",
    baseUrl + "5",
    createModel,
    5
  );

  validateCustomApiFilter<Model, [IdOr<Site>], Service>(
    spec,
    AudioRecording,
    baseUrl + "filter",
    "filterBySite",
    { filter: { siteId: { eq: 5 } } },
    undefined,
    5
  );

  describe("downloadUrl", () => {
    it("should return downloadUrl", () => {
      const apiRoot = spec.inject(ConfigService).endpoints.apiRoot;
      const id = modelData.id();
      expect(spec.service.downloadUrl(id)).toBe(
        `${apiRoot}/audio_recordings/${id}/original`
      );
    });
  });

  describe("batchDownloadUrl", () => {
    let downloadUrl: string;
    const filterQsp = "filter_encoded=";
    const authTokenQsp = "auth_token=";

    function setAuthToken(authToken: AuthToken) {
      spyOnProperty(sessionState, "isLoggedIn").and.returnValue(!!authToken);
      spyOnProperty(sessionState, "authToken").and.returnValue(authToken);
    }

    beforeEach(() => {
      const config = spec.inject(ConfigService);
      downloadUrl = config.endpoints.apiRoot + baseUrl + "downloader?";
    });

    it("should snake case filter", () => {
      const filter = { filter: { durationSeconds: { eq: 10 } } };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const snakeCaseFilter = { filter: { duration_seconds: { eq: 10 } } };

      setAuthToken(undefined);
      const expectation =
        downloadUrl + filterQsp + toBase64Url(JSON.stringify(snakeCaseFilter));
      expect(spec.service.batchDownloadUrl(filter)).toBe(expectation);
    });

    it("should set auth token if logged in", () => {
      const authToken = modelData.authToken();
      setAuthToken(authToken);
      const expectation =
        downloadUrl +
        filterQsp +
        toBase64Url(JSON.stringify({})) +
        "&" +
        authTokenQsp +
        authToken;
      expect(spec.service.batchDownloadUrl({})).toBe(expectation);
    });

    it("should not set auth token if not logged in", () => {
      setAuthToken(undefined);
      const expectation =
        downloadUrl + filterQsp + toBase64Url(JSON.stringify({}));
      expect(spec.service.batchDownloadUrl({})).toBe(expectation);
    });
  });
});
