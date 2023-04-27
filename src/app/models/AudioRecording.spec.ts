import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { AudioRecording } from "./AudioRecording";
import { Project } from "./Project";
import { Region } from "./Region";
import { Site } from "./Site";

describe("AudioRecording", () => {
  let audioRecordingModel: AudioRecording;
  let projectModel: Project;
  let regionModel: Region;
  let siteModel: Site;

  const createAudioRecordingModel = (): AudioRecording =>
    new AudioRecording(generateAudioRecording());

  const createProjectModel = (): Project => new Project(generateProject());

  const createRegionModel = (): Region => new Region(generateRegion());

  const createSiteModel = (): Site => new Site(generateSite());

  beforeEach(() => {
    audioRecordingModel = createAudioRecordingModel();
    projectModel = createProjectModel();
    regionModel = createRegionModel();
    siteModel = createSiteModel();
  });

  it("should create", () => {
    expect(audioRecordingModel).toBeInstanceOf(AudioRecording);
  });

  describe("audio recording routes", () => {
    it("should construct correct batch download url", () => {
      const expectedUrl = "/audio_recordings/download";
      const realizedUrl = audioRecordingModel.getBatchDownloadUrl();

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct analyses download URL", () => {
      const expectedUrl = `/audio_recordings/${audioRecordingModel.id}/analysis_jobs/system/results`;
      const realizedUrl = audioRecordingModel.getAnalysisResultsUrl();

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct details URL", () => {
      const expectedUrl = `/audio_recordings/${audioRecordingModel.id}`;
      const realizedUrl = audioRecordingModel.getDetailsUrl();

      expect(realizedUrl).toEqual(expectedUrl);
    });
  });

  describe("project audio recording routes", () => {
    it("should construct correct batch download url", () => {
      const expectedUrl = `/projects/${projectModel.id}/audio_recordings/download`;
      const realizedUrl = audioRecordingModel.getBatchDownloadUrl(projectModel);

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct analyses download URL", () => {
      const expectedUrl = `/projects/${projectModel.id}/audio_recordings/${audioRecordingModel.id}/analysis_jobs/system/results`;
      const realizedUrl =
        audioRecordingModel.getAnalysisResultsUrl(projectModel);

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct details URL", () => {
      const expectedUrl = `/projects/${projectModel.id}/audio_recordings/${audioRecordingModel.id}`;
      const realizedUrl = audioRecordingModel.getDetailsUrl(projectModel);

      expect(realizedUrl).toEqual(expectedUrl);
    });
  });

  describe("region audio recording routes", () => {
    it("should construct correct batch download url", () => {
      const expectedUrl = `/projects/${projectModel.id}/regions/${regionModel.id}/audio_recordings/download`;
      const realizedUrl = audioRecordingModel.getBatchDownloadUrl(
        projectModel,
        regionModel
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct analyses download URL", () => {
      const expectedUrl = `/projects/${projectModel.id}/regions/${regionModel.id}` +
      `/audio_recordings/${audioRecordingModel.id}/analysis_jobs/system/results`;

      const realizedUrl = audioRecordingModel.getAnalysisResultsUrl(
        projectModel,
        regionModel
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct details URL", () => {
      const expectedUrl = `/projects/${projectModel.id}/regions/${regionModel.id}/audio_recordings/${audioRecordingModel.id}`;
      const realizedUrl = audioRecordingModel.getDetailsUrl(
        projectModel,
        regionModel
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });
  });

  describe("site audio recording routes", () => {
    it("should construct correct batch download url", () => {
      const expectedUrl = `/projects/${projectModel.id}/regions/${regionModel.id}/points/${siteModel.id}/audio_recordings/download`;
      const realizedUrl = audioRecordingModel.getBatchDownloadUrl(
        projectModel,
        regionModel,
        siteModel
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct analyses download URL", () => {
      const expectedUrl =
        `/projects/${projectModel.id}/regions/${regionModel.id}/points/` +
        `${siteModel.id}/audio_recordings/${audioRecordingModel.id}/analysis_jobs/system/results`;

      const realizedUrl = audioRecordingModel.getAnalysisResultsUrl(
        projectModel,
        regionModel,
        siteModel
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should construct correct details URL", () => {
      const expectedUrl =
        `/projects/${projectModel.id}/regions/${regionModel.id}/points/` +
        `${siteModel.id}/audio_recordings/${audioRecordingModel.id}`;

      const realizedUrl = audioRecordingModel.getDetailsUrl(
        projectModel,
        regionModel,
        siteModel
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });
  });
});
