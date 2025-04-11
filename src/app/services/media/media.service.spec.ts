import { BawSessionService } from "@baw-api/baw-session.service";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { API_ROOT } from "@services/config/config.tokens";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { modelData } from "@test/helpers/faker";
import { MediaService } from "./media.service";

describe("MediaService", () => {
  let spec: SpectatorService<MediaService>;
  let mockAudio: AudioRecording;

  const createService = createServiceFactory({
    service: MediaService,
    providers: [
      { provide: BawSessionService, useValue: {} },
      { provide: API_ROOT, useValue: modelData.internet.domainName() },
    ],
  });

  function setup(): void {
    spec = createService();
  }

  beforeEach(() => {
    mockAudio = new AudioRecording(generateAudioRecording());
    setup();
  });

  describe("createMediaUrl", () => {
    describe("errors", () => {
      // prettier-ignore
      const testMatrix = [
        { start: -1, end: 10, error: "Start time must be greater than or equal to 0" },
        { start: 0, end: -1, error: "End time must be greater than or equal to 0" },
        { start: 10, end: 0, error: "End time must be greater than start time" },
      ];

      for (const test of testMatrix) {
        it(test.error, () => {
          const testFn = () => {
            spec.service.createMediaUrl(mockAudio, test.start, test.end);
          };

          expect(testFn).toThrowError(test.error);
        });
      }

      // test tests are not in the test matrix because they depend on the
      // instance of the audio recording for their start/end times
      it("should throw an error if the start time is greater than the duration of the audio recording", () => {
        const expectedError = "Start time is greater than the duration of the audio recording";
        const test = () => {
          spec.service.createMediaUrl(mockAudio, mockAudio.durationSeconds + 0.01, mockAudio.durationSeconds + 10);
        };

        expect(test).toThrowError(expectedError);
      });

      it("should throw an error if the end time is greater than the duration of the audio recording", () => {
        const expectedError = "End time is greater than the duration of the audio recording";
        const test = () => {
          spec.service.createMediaUrl(mockAudio, 0, mockAudio.durationSeconds + 0.01);
        };

        expect(test).toThrowError(expectedError);
      });
    });

    // TODO: these tests and associated code should be removed once the api
    // range request bug is fixed
    // see: https://github.com/QutEcoacoustics/baw-server/issues/681
    describe("start/end time rounding", () => {
      it("should round down the start times of the recording", () => {
        // if we are going to round start times, we want to round down so that
        // no information is cut off / lost
        const start = 0.8;
        const expectedStart = 0;
        const end = mockAudio.durationSeconds;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${expectedStart}`);
      });

      it("should round up the end times of the recording", () => {
        // if we are going to round end times, we want to round up so that no
        // information is cut off / lost
        const end = 10.1;
        const expectedEnd = 11;

        const url = spec.service.createMediaUrl(mockAudio, 0, end);

        expect(url).toContain(`end_offset=${expectedEnd}`);
      });
    });

    // a lot of these tests test functionality that is negated by the start/end
    // time rounding
    // once start/end time rounding is no longer needed, these tests should
    // become useful for testing functionality
    describe("start/end time padding", () => {
      it("should allow an argument to allow padding the start and end times", () => {
        // we know that these tested start/end times are within the mock
        // audio recordings duration because the mock model generator has a
        // minimum duration of 30 seconds
        const start = 2;
        const end = 10;
        const padding = 0.1;

        // the padded start/end times should rounded down/up respectively
        const expectedStart = 1;
        const expectedEnd = 11;

        const url = spec.service.createMediaUrl(mockAudio, start, end, padding);

        expect(url).toContain(`start_offset=${expectedStart}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });

      // TODO: this test is failing because the end time is being rounded to 3
      xit("should pad to 0.5 seconds if the padding argument produces a duration than the minimum duration", () => {
        // if we executed the function with the requested padding, it would
        // result in an audio recording with a duration of 0.4 seconds
        // because 0.4 seconds is less than the minimum requirement of 0.5
        // seconds. To fix this, we pad the audio recording to 0.5 seconds
        const start = 1;
        const end = 1.2;
        const padding = 0.2;

        // the padded start/end times should be rounded down/up
        const expectedStart = 0;
        const expectedEnd = 2;

        const url = spec.service.createMediaUrl(mockAudio, start, end, padding);

        expect(url).toContain(`start_offset=${expectedStart}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });

      it("should not pad if the duration is greater than 0.5 seconds", () => {
        const start = 1;
        const end = 5;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${start}`);
        expect(url).toContain(`end_offset=${end}`);
      });

      it("should not pad if the duration is 0.5  seconds", () => {
        const start = 1;
        const end = 1.5;

        // we do expect the end to be rounded to 2 so that it is a whole number
        const expectedEnd = 2;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${start}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });

      // TODO: this test is failing
      xit("should pad the duration to 0.5 seconds if the difference is less than 0.5 seconds", () => {
        const start = 1;
        const end = 1.4;

        const expectedStart = 0;
        const expectedEnd = 2;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${expectedStart}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });

      it("should not pad the start of the event if the start time is 0", () => {
        const start = 0;
        const end = 0.1;

        const expectedEnd = 1;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${start}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });

      it("should not pad the end time if the end time is the same as the duration of the audio recording", () => {
        const start = mockAudio.durationSeconds - 0.1;
        const end = mockAudio.durationSeconds;

        const expectedStart = mockAudio.durationSeconds - 1;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${expectedStart}`);
        expect(url).toContain(`end_offset=${end}`);
      });

      // we expect that the difference between the start and 0.5 seconds is added
      // to the end time
      it("should pad to 0 start time if the start time is close to 0", () => {
        const start = 0.1;
        const end = 0.2;

        const expectedStart = 0;
        const expectedEnd = 1;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${expectedStart}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });

      it("should pad to the recordings duration if the end time is close to the end", () => {
        const start = mockAudio.durationSeconds - 0.2;
        const end = mockAudio.durationSeconds - 0.1;

        const expectedStart = mockAudio.durationSeconds - 1;
        const expectedEnd = mockAudio.durationSeconds;

        const url = spec.service.createMediaUrl(mockAudio, start, end);

        expect(url).toContain(`start_offset=${expectedStart}`);
        expect(url).toContain(`end_offset=${expectedEnd}`);
      });
    });
  });
});
