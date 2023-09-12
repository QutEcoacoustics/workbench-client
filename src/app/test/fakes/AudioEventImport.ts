import { IAudioEventImport } from "@models/AudioEventImport";
import { IAudioEventImportFileRead } from "@models/AudioEventImport/AudioEventImportFileRead";
import { modelData } from "@test/helpers/faker";

export function generateAudioEventImport(
    data?: Partial<IAudioEventImport>
): Required<IAudioEventImport> {
    return {
        id: modelData.id(),
        name: modelData.param(),
        description: modelData.description(),
        descriptionHtml: modelData.description(),
        descriptionHtmlTagline: modelData.description(),
        createdAt: modelData.dateTime(),
        updatedAt: modelData.dateTime(),
        deletedAt: modelData.dateTime(),
        creatorId: modelData.id(),
        deleterId: modelData.id(),
        updaterId: modelData.id(),
        files: modelData.randomArray<IAudioEventImportFileRead>(10, 20, () =>
            Object({
                name: modelData.param(),
                importedAt: modelData.dateTime(),
                additionalTags: modelData.ids(),
            }),
        ),
        importedEvents: modelData.randomArray<IAudioEventImport>(10, 20, () =>
            Object({
                id: modelData.id(),
                audioRecordingId: modelData.id(),
                startTimeSeconds: modelData.datatype.number(),
                endTimeSeconds: modelData.datatype.number(),
                lowFrequencyHertz: modelData.datatype.number(),
                highFrequencyHertz: modelData.datatype.number(),
                isReference: modelData.datatype.boolean(),
                taggings: modelData.randomArray(10, 20, () =>
                    Object({
                        tagId: modelData.id(),
                        startTimeSeconds: modelData.datatype.number(),
                        endTimeSeconds: modelData.datatype.number(),
                    }),
                ),
                provenanceId: modelData.id(),
                errors: [],
            })
        ),
        ...data,
    };
}
