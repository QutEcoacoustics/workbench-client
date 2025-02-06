import { projectRoute } from "@components/projects/projects.routes";

const analysesPath = "analysis_jobs";
const analysisJobPath = ":analysisJobId";

export const analysesRoute = projectRoute.addFeatureModule(analysesPath);
export const analysisJobRoute = analysesRoute.add(analysisJobPath);
