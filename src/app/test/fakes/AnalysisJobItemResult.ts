import { rootPath } from "@components/audio-recordings/pages/analysis-results/analyses-results.component";
import {
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
    path: `${rootPath}/${modelData.system.fileName()}`,
    analysisJobId: modelData.id(),
    audioRecordingId: modelData.id(),
    name: `${rootPath}/${modelData.system.fileName()}`,
    sizeBytes: modelData.datatype.number(1000),
    hasChildren: modelData.bool(),
    hasZip: modelData.bool(),
    type: modelData.helpers.arrayElement(resultItemTypes),
    children: [],
    parentItem: null,
    open: true,
    ...data,
  };
}
