import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { ImageUrl } from "@interfaces/apiInterfaces";
import { assertImage } from "./html";

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
 * @deprecated
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

/**
 * Assert detail view is correct
 */
export function assertDetail(detail: Detail) {
  describe(`${detail.label} (${detail.key})`, function () {
    it("should display " + detail.key, function () {
      const index = findDetailIndex(this.fixture.nativeElement, detail.label);
      expect(index).toBeGreaterThanOrEqual(0);
    });

    it("should display " + detail.key + " value", function () {
      const element: HTMLElement = this.fixture.nativeElement;
      const index = findDetailIndex(element, detail.label);
      const views = element.querySelectorAll("dl");

      assertValue(detail, index, views);
    });
  });
}

//
// Group of functions handling asserting the various types of detail views
//

function assertValue(
  detail: View,
  index: number,
  views: NodeListOf<HTMLDListElement>
) {
  if (isInstantiated(detail.checkbox)) {
    assertCheckbox(views[index], detail.checkbox);
  } else if (isInstantiated(detail.code)) {
    assertCode(views[index], detail.code);
  } else if (isInstantiated(detail.plain)) {
    assertPlainText(views[index], detail.plain);
  } else if (isInstantiated(detail.model)) {
    assertModel(views[index], detail.model);
  } else if (isInstantiated(detail.image)) {
    assertImageUrl(views[index], detail.image);
  } else if (isInstantiated(detail.children)) {
    assertChildren(index, views, detail.children);
  } else {
    fail("Detail value not set");
  }
}

function assertCheckbox(view: HTMLDListElement, value: boolean) {
  const checkbox: HTMLInputElement = view.querySelector("input");
  expect(!!checkbox.checked).toBe(value);
}

function assertCode(view: HTMLDListElement, value: object) {
  const code: HTMLElement = view.querySelector("#code");
  expect(code.innerHTML.trim()).toBe(JSON.stringify(value));
}

function assertPlainText(view: HTMLDListElement, value: string | number) {
  const plainText: HTMLElement = view.querySelector("#plain");
  expect(plainText.innerHTML.trim()).toBe(value.toString());
}

function assertModel(view: HTMLDListElement, value: string) {
  const model: HTMLElement = view.querySelector("#model");
  expect(model.innerHTML.trim()).toBe(value);
}

function assertImageUrl(view: HTMLDListElement, value: string | ImageUrl[]) {
  const image: HTMLImageElement = view.querySelector("#image");
  assertImage(
    image,
    value instanceof Array ? value[0].url : value,
    "model image alt"
  );
}

function assertChildren(
  index: number,
  views: NodeListOf<HTMLDListElement>,
  values: View[]
) {
  values.forEach((value, childNo) => {
    assertValue(value, index + childNo, views);
  });
}

export interface Detail extends View {
  label: string;
  key: string;
}

interface View {
  checkbox?: boolean;
  code?: object;
  plain?: string | number;
  model?: string;
  image?: string | ImageUrl[];
  children?: View[];
}
