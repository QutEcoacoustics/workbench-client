import { projectRoute } from "@components/projects/projects.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const analysesPath = "audio_analysis";
const analysisJobPath = ":analysisJobId";

export const oldClientAnalysesRoute = StrongRoute.newRoot().add(analysesPath);
export const oldClientAnalysisJobRoute = oldClientAnalysesRoute.add(analysisJobPath);
export const oldClientNewAnalysisJobRoute = oldClientAnalysesRoute.add("new");
export const oldClientAnalysisJobResultsRoute = oldClientAnalysisJobRoute.add("results");

export const audioAnalysesRoute = projectRoute.addFeatureModule(analysesPath);
export const audioAnalysisJobRoute = audioAnalysesRoute.add(analysisJobPath);
