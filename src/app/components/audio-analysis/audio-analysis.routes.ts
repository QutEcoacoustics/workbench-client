import { projectRoute } from "@components/projects/projects.routes";

export const audioAnalysisRoute = projectRoute.addFeatureModule("analysis_jobs");
export const analysisJobRoute = audioAnalysisRoute.add(":analysisJobId");
