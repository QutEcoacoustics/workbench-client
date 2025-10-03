import { StrongRoute } from "@interfaces/strongRoute";

export const provenancesRoute = StrongRoute.newRoot().add("provenances");
export const provenanceRoute = provenancesRoute.add(":provenanceId");
