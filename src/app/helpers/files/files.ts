/**
 * An `Array.prototype.sort()` function that can be used to sort an array of paths
 * into a flattened tree like hierarchy with sub-items appearing under their parent folder.
 *
 * @param pathA path A
 * @param pathB path B
 * @returns A sorted array representing in what order paths should be rendered to create a tree
 */
export function compareByPath(pathA: string = "/", pathB: string = "/"): number {
  // TODO: this function doesn't work very well in other languages that don't use ASCII. We should probably rewrite this using localeCompare
  const pathABins: string[] = pathA.split("/");
  const pathBBins: string[] = pathB.split("/");

  for (let i = 0; i < pathABins.length; i++) {
    const pathComparisonResult = pathABins[i].localeCompare(pathBBins[i]);

    if (pathComparisonResult !== 0) {
      return pathComparisonResult;
    }
  }

  return 0;
}
