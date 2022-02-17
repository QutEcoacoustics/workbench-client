import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr } from "@baw-api/api-common";
import { toBase64Url } from "@helpers/encoding/encoding";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { Session } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateSessionUser } from "@test/fakes/User";
import {
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { AudioRecordingsService } from "./audio-recordings.service";

type Model = AudioRecording;
type Params = [];
type Service = AudioRecordingsService;

describe("AudioRecordingsService", function () {
  const createModel = () =>
    new AudioRecording(generateAudioRecording({ id: 5 }));
  const baseUrl = "/audio_recordings/";
  let spec: SpectatorService<AudioRecordingsService>;
  const createService = createServiceFactory({
    service: AudioRecordingsService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    spec = createService();
    this.service = spec.service;
  });

  validateApiList<Model, Params, Service>(baseUrl);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter");
  validateApiShow<Model, Params, Service>(baseUrl + "5", 5, createModel);

  validateCustomApiFilter<Model, [...Params, IdOr<Site>], Service>(
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

    beforeEach(() => {
      const config = spec.inject(ConfigService);
      downloadUrl = config.endpoints.apiRoot + baseUrl + "downloader?";
    });

    it("should snake case filter", () => {
      const filter = { filter: { durationSeconds: { eq: 10 } } };
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const snakeCaseFilter = { filter: { duration_seconds: { eq: 10 } } };

      spyOn(spec.service, "getLocalUser").and.returnValue(undefined);
      const expectation =
        downloadUrl + filterQsp + toBase64Url(JSON.stringify(snakeCaseFilter));
      expect(spec.service.batchDownloadUrl(filter)).toBe(expectation);
    });

    it("should set auth token if logged in", () => {
      const user = new Session(generateSessionUser());
      spyOn(spec.service, "getLocalUser").and.returnValue(user);
      const expectation =
        downloadUrl +
        filterQsp +
        toBase64Url(JSON.stringify({})) +
        "&" +
        authTokenQsp +
        user.authToken;
      expect(spec.service.batchDownloadUrl({})).toBe(expectation);
    });

    it("should not set auth token if not logged in", () => {
      spyOn(spec.service, "getLocalUser").and.returnValue(undefined);
      const expectation =
        downloadUrl + filterQsp + toBase64Url(JSON.stringify({}));
      expect(spec.service.batchDownloadUrl({})).toBe(expectation);
    });
  });
});
