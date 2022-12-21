import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { AudioRecording } from "./AudioRecording";

describe("AudioRecording", () => {
  let audioRecordingModel: AudioRecording;

  const createModel = (): AudioRecording =>
    new AudioRecording(generateAudioRecording());

  beforeEach(() => audioRecordingModel = createModel());

  it("should create", () => {
    expect(audioRecordingModel).toBeInstanceOf(AudioRecording);
  });

  it("should construct correct batch download route", () => {
    const expectedUrl = "/audio_recordings/download";
    const realizedUrl = audioRecordingModel.getBatchDownloadUrl();

    expect(realizedUrl).toEqual(expectedUrl);
  });

  it("should construct correct analyses download URL", () => {
    const expectedUrl = `/audio_recordings/${audioRecordingModel.id}/results`;
    const realizedUrl = audioRecordingModel.getAnalysisResultsUrl();

    expect(realizedUrl).toEqual(expectedUrl);
  });

  it("should construct correct details URL", () => {
    const expectedUrl = `/audio_recordings/${audioRecordingModel.id}`;
    const realizedUrl = audioRecordingModel.getDetailsUrl();

    expect(realizedUrl).toEqual(expectedUrl);
  });
});
