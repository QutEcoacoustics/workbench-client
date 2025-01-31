import { StrongRoute } from "@interfaces/strongRoute";

/** /scripts */
export const scriptsRoute = StrongRoute.newRoot().addFeatureModule("scripts");

/** /scripts/:scriptId */
export const scriptRoute = scriptsRoute.add(":scriptId");
