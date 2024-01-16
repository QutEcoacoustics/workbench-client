import { patchLuxonDuration } from "./luxon";

export function applyMonkeyPatches(): void {
  patchLuxonDuration();
}
