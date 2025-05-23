import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import { modelData } from "@test/helpers/faker";
import {
  ImportAnnotationService,
  ImportedFileWithErrors,
} from "./import-annotation.service";

function createMockImportFile(
  errors: Record<PropertyKey, string>[] = [],
): ImportedFileWithErrors {
  return {
    model: new AudioEventImportFile(generateAudioEventImportFile()),
    errors,
  };
}

describe("ImportAnnotationService", () => {
  let spec: SpectatorService<ImportAnnotationService>;

  const createService = createServiceFactory({
    service: ImportAnnotationService,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should be created", () => {
    expect(spec.service).toBeInstanceOf(ImportAnnotationService);
  });

  it("should reset the state of the service if a new instance is created", () => {
    const initialUpload = spec.service.newInstance();
    initialUpload.set([
      createMockImportFile(),
      createMockImportFile([{ 0: "Validation failed" }]),
    ]);

    const newUpload = spec.service.newInstance();

    expect(newUpload().length).toEqual(0);
  });

  it("should not return a writable signal if connecting to an import instance", () => {
    spec.service.newInstance();

    const consumerSignal = spec.service.connect();
    expect(consumerSignal).not.toBeWriteableSignal();
  });

  it("should correctly extract errors", () => {
    const duplicateError = `is not unique. Duplicate record found with id: ${modelData.id()}`;

    const uploadInstance = spec.service.newInstance();
    uploadInstance.set([
      createMockImportFile([{ 0: "is not an acceptable content type" }]),
      createMockImportFile(),
      createMockImportFile([{ 0: "Validation failed" }]),
      createMockImportFile(),
      createMockImportFile(),
      createMockImportFile([{ 0: duplicateError }]),
    ]);

    const expectedErrors = [
      { 0: "is not an acceptable content type" },
      { 0: "Validation failed" },
      { 0: duplicateError },
    ] as any;
    const realizedErrors = spec.service.importErrors();

    expect(realizedErrors).toEqual(expectedErrors);
  });
});
