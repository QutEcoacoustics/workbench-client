/**
 * An `Array.prototype.sort()` function that can be used to sort an array of paths
 * into a flattened tree like hierarchy with sub-items appearing under their parent folder.
 *
 * @param a path A
 * @param b path B
 * @returns A sorted array representing in what order paths should be rendered to create a tree
 */
export function compareByPath(a: string = "/", b: string = "/"): number {
  const pathABins = a.split("/");
  const pathBBins = b.split("/");

  for (let i = 0; i < pathABins.length; i++) {
    if (i > pathBBins.length) {
      return -1;
    }

    if (pathABins[i] < pathBBins[i]) {
      return -1;
    } else if (pathABins[i] > pathBBins[i]) {
      return 1;
    }
  }

  return 0;
}
