import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { ImageUrl, toRelative } from "@interfaces/apiInterfaces";
import { AbstractModelWithSite } from "@shared/timezone/timezone.component";
import { DateTime, Duration } from "luxon";
import { assertTooltip } from "./html";

/**
 * Find a label from a list of detail view items
 *
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
    assertImages(views[index], detail.image);
  } else if (isInstantiated(detail.children)) {
    assertChildren(index, views, detail.children);
  } else if (isInstantiated(detail.date)) {
    assertDateTime(views[index], detail.date);
  } else {
    fail("Detail value not set");
  }
}

function assertCheckbox(view: HTMLDListElement, value: boolean) {
  const checkbox: HTMLInputElement = view.querySelector("input");
  expect(!!checkbox.checked).toBe(value);
}

function assertCode(view: HTMLDListElement, value: Record<string, any>) {
  const code: HTMLElement = view.querySelector("#code");
  expect(code).toHaveText(JSON.stringify(value, null, 2));
}

function assertPlainText(
  view: HTMLDListElement,
  value: string | number | Duration
) {
  const plainText: HTMLElement = view.querySelector("#plain");
  let result: string;

  if (value instanceof Duration) {
    result = `${value.toISO()} (${toRelative(value)})`;
  } else {
    result = value.toString();
  }

  expect(plainText.innerText).toContain(result);
}

function assertDateTime(
  view: HTMLDListElement,
  value: { model?: AbstractModelWithSite; dateTime: DateTime }
) {
  const timezone: HTMLElement = view.querySelector("baw-date");
  expect(timezone).toHaveText(value.dateTime.toFormat("yyyy-LL-dd HH:mm"));

  // Validate model was passed through
  if (value.model?.site) {
    assertTooltip(timezone, value.model.site?.tzinfoTz);
  }
}

function assertModel(view: HTMLDListElement, value: string) {
  const model: HTMLElement = view.querySelector("#model");
  expect(model.innerText).toContain(value);
}

function assertImages(view: HTMLDListElement, value: string | ImageUrl[]) {
  const image: HTMLImageElement = view.querySelector("#image");
  expect(image).toHaveImage(value instanceof Array ? value[0].url : value, {
    alt: "model image alt",
  });
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
  code?: Record<string, any>;
  date?: { model?: AbstractModelWithSite; dateTime: DateTime };
  plain?: string | number | Duration;
  model?: string;
  image?: string | ImageUrl[];
  children?: View[];
}
