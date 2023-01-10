export function compareByPath(
  a: string = "/",
  b: string = "/"
): number {
  const aSplitPaths = a.split("/");
  const bSplitPaths = b.split("/");

  console.log(aSplitPaths);
  console.log(bSplitPaths);

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < aSplitPaths.length; i++) {
    if (i > bSplitPaths.length) {
      return -1;
    }

    if (aSplitPaths[i] < bSplitPaths[i]) {
      return -1;
    } else if (aSplitPaths[i] > bSplitPaths[i]) {
      return 1;
    }
  }

  return 0;
}
