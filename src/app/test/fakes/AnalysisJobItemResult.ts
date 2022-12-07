import {
  AnalysisJobItemResult,
  IAnalysisJobItemResult,
  ResultsItemType,
} from "@models/AnalysisJobItemResult";
import { modelData } from "@test/helpers/faker";

export function generateAnalysisJobResults(
  data?: Partial<IAnalysisJobItemResult>
): Required<IAnalysisJobItemResult> {
  const resultItemTypes: ResultsItemType[] = ["directory", "file"];

  return {
    id: modelData.id(),
    resultsPath: modelData.system.fileName(),
    analysisJobId: modelData.id(),
    audioRecordingId: modelData.id(),
    name: modelData.param(),
    sizeBytes: modelData.datatype.number(1000),
    hasChildren: modelData.bool(),
    hasZip: modelData.bool(),
    type: modelData.helpers.arrayElement(resultItemTypes),
    children: [],
    ...data,
  };
}

export const analysisJobResultsDemoData: AnalysisJobItemResult[] =
  [
    new AnalysisJobItemResult(
      generateAnalysisJobResults(
        new AnalysisJobItemResult(generateAnalysisJobResults({
          resultsPath: "/",
          children: [
            new AnalysisJobItemResult(
              generateAnalysisJobResults({
                resultsPath: "FolderA",
                children: [
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({
                      resultsPath: "FolderA/sub_folder",
                      children: [
                        new AnalysisJobItemResult(
                          generateAnalysisJobResults({
                            resultsPath: "FolderA/sub_folder/file.wav",
                          })
                        ),
                      ],
                    })
                  ),
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({
                      resultsPath:
                        "FolderA/Sound_File2022-11-05T08:15:30-05:00.wav",
                    })
                  ),
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({
                      resultsPath:
                        "FolderA/Example_File2022-10-22-T00:00:00.wav",
                    })
                  ),
                ],
              })
            ),
            new AnalysisJobItemResult(
              generateAnalysisJobResults({
                resultsPath: "FolderB",
                children: [
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({ resultsPath: "FolderB/a.csv" })
                  ),
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({ resultsPath: "FolderB/b.csv" })
                  ),
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({ resultsPath: "FolderB/c.csv" })
                  ),
                ],
              })
            ),
          ],
        })
      )
    )),
  ];
