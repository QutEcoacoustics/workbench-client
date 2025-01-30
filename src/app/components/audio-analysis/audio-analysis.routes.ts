import { projectRoute } from "@components/projects/projects.routes";

export const audioAnalysisRoutes = projectRoute.addFeatureModule("analysis_jobs");
export const analysisJobRoute = audioAnalysisRoutes.add(":analysisId");
