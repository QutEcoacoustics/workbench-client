import { projectRoute } from "@components/projects/projects.routes";
import { StrongRoute } from "@interfaces/strongRoute";

const analysesPath = "analysis_jobs";
const analysisJobPath = ":analysisJobId";

export const oldBawClientAnalysesRoute = StrongRoute.newRoot().add(analysesPath);
export const oldBawClientAnalysisJobRoute = oldBawClientAnalysesRoute.add(analysisJobPath);

export const audioAnalysesRoute = projectRoute.addFeatureModule(analysesPath);
export const audioAnalysisJobRoute = audioAnalysesRoute.add(analysisJobPath);
