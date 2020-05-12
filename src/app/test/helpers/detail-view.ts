/**
 * Find a label from a list of detail view items
 * @param nativeElement Fixture native element
 * @param label Label to find
 */
function findDetailIndex(nativeElement: HTMLElement, label: string) {
  let detailIndex = -1;
  const details = nativeElement.querySelectorAll("dt");
  details.forEach((detail, index) => {
    if (detail.innerText.trim() === label) {
      detailIndex = index;
      return;
    }
  });
  return detailIndex;
}

/**
 * Assert detail view is correct
 * @param label Detail view label
 * @param key Model key where data is stored (if association, give the base key)
 * @param response Expected response
 */
export function assertDetailView(
  label: string,
  key: string,
  response?: string | string[] | boolean
) {
  describe(`${label} (${key})`, function () {
    it("should display " + key, function () {
      const index = findDetailIndex(this.fixture.nativeElement, label);
      expect(index).toBeGreaterThanOrEqual(0);
    });

    it("should display " + key + " value", function () {
      const index = findDetailIndex(this.fixture.nativeElement, label);
      const views = (this.fixture
        .nativeElement as HTMLElement).querySelectorAll("dl");

      if (response instanceof Array) {
        expect(views.length).toBe(response.length);
        (response as string[]).forEach((output, i) => {
          expect(views[index + i].innerText.trim()).toBe(output);
        });
      } else if (typeof response === "boolean") {
        const view = views[index].querySelector("input");
        if (response) {
          expect(view.checked).toBeTruthy();
        } else {
          expect(view.checked).toBeFalsy();
        }
      } else {
        const view = views[index];
        expect(view.innerText.trim()).toBe(response);
      }
    });
  });
}
