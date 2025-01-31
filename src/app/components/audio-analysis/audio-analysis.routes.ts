import { projectRoute } from "@components/projects/projects.routes";

export const audioAnalysesRoute = projectRoute.addFeatureModule("analysis_jobs");
export const audioAnalysisJobRoute = audioAnalysesRoute.add(":analysisJobId");
