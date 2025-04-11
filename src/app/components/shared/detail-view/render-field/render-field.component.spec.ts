import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";

import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { User } from "@models/User";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/config/config.service";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { modelData } from "@test/helpers/faker";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Subject } from "rxjs";
import { DurationComponent } from "@shared/datetime-formats/duration/duration.component";
import { TimeSinceComponent } from "@shared/datetime-formats/time-since/time-since.component";
import { ZonedDateTimeComponent } from "@shared/datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { withDefaultZone } from "@test/helpers/mocks";
import { LoadingComponent } from "@shared/loading/loading.component";
import { ModelLinkComponent } from "../model-link/model-link.component";
import { ModelView, RenderFieldComponent } from "./render-field.component";

describe("RenderFieldComponent", () => {
  let spec: SpectatorHost<RenderFieldComponent>;
  const createComponent = createHostFactory({
    component: RenderFieldComponent,
    declarations: [CheckboxComponent, ModelLinkComponent],
    imports: [
      MockBawApiModule,
      RouterTestingModule,
      PipesModule,
      DatetimeComponent,
      ZonedDateTimeComponent,
      DurationComponent,
      TimeSinceComponent,
      LoadingComponent,
      CheckboxComponent,
    ],
  });

  const getElement = {
    code: () => spec.queryAll<HTMLPreElement>("dl #code"),
    normal: () => spec.queryAll<HTMLParagraphElement>("dl #plain"),
    model: () => spec.queryAll<HTMLSpanElement>("#model"),
    ghost: () => spec.queryAll<HTMLSpanElement>("#ghost"),
    image: () => spec.queryAll<HTMLImageElement>("dl #image"),
    checkbox: () => spec.queryAll<HTMLElement>("dl #checkbox"),
    duration: () => spec.queryAll<HTMLElement>("baw-duration"),
    zonedDateTime: () => spec.queryAll<HTMLElement>("baw-zoned-datetime"),
    localizedDateTime: () => spec.queryAll<HTMLElement>("baw-datetime"),
    values: () => spec.queryAll("dl").map((el) => el.firstElementChild as HTMLElement),
  };

  function setup(value: ModelView) {
    spec = createComponent('<baw-render-field [value]="value"></baw-render-field>', {
      detectChanges: false,
      hostProps: { value },
    });
  }

  function assertNotLoading(value?: HTMLElement) {
    value ??= getElement.normal()[0];

    if (!value) {
      expect(value).toBeFalsy();
    } else {
      expect(value).not.toContainText("(loading)");
    }
  }

  function objectToString(value: any): string {
    return JSON.stringify(value, null, 4);
  }

  function assertLoading(value?: HTMLElement) {
    expect(value ?? getElement.normal()[0]).toHaveExactText("(loading)");
  }

  function assertNoValue(value?: HTMLElement) {
    expect(value ?? getElement.normal()[0]).toHaveExactText("(no value)");
  }

  function assertError(value?: HTMLElement) {
    expect(value ?? getElement.normal()[0]).toHaveExactText("(error)");
  }

  describe("undefined input", () => {
    it("should handle undefined value", () => {
      setup(undefined);
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should display undefined value", () => {
      setup(undefined);
      spec.detectChanges();
      assertNoValue();
    });
  });

  describe("string input", () => {
    function spyOnIsImage() {
      spec.component["isImage"] = jasmine.createSpy().and.callFake((_, __, onerror: () => void) => onerror());
    }

    it("should handle string value", () => {
      setup("testing");
      spyOnIsImage();
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should display empty string value", () => {
      setup("");
      spyOnIsImage();
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value).toHaveExactText("");
    });

    it("should display string value", () => {
      setup("testing");
      spyOnIsImage();
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value).toHaveExactText("testing");
    });
  });

  describe("number input", () => {
    it("should handle number value", () => {
      setup(1);
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should display zero number value", () => {
      setup(0);
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value).toHaveExactText("0");
    });

    it("should display number value", () => {
      setup(1);
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value).toHaveExactText("1");
    });
  });

  describe("checkbox input", () => {
    it("should handle true input", () => {
      setup(true);
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.checkbox().length).toBe(1);
    });

    it("should display true input", () => {
      setup(true);
      spec.detectChanges();
      const value = getElement.checkbox()[0].querySelector("input");
      expect(value.checked).toBeTruthy();
      expect(value.disabled).toBeTruthy();
    });

    it("should handle false input", () => {
      setup(false);
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.checkbox().length).toBe(1);
    });

    it("should display false input", () => {
      setup(false);
      spec.detectChanges();
      const value = getElement.checkbox()[0].querySelector("input");
      expect(value.checked).toBeFalsy();
      expect(value.disabled).toBeTruthy();
    });
  });

  describe("object input", () => {
    it("should handle object value", () => {
      setup({ testing: 42 });
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.code().length).toBe(1);
    });

    it("should display empty object value", () => {
      setup({});
      spec.detectChanges();
      const value = getElement.code()[0];
      expect(value.innerText).toContain(objectToString({}));
    });

    it("should display object value", () => {
      setup({ value1: 42, value2: "test" });
      spec.detectChanges();
      const value = getElement.code()[0];
      expect(value.innerText).toContain(objectToString({ value1: 42, value2: "test" }));
    });

    it("should display object error when JSON stringy fails", () => {
      // Create cyclic object should fail JSON.stringify
      const cyclicObject = { a: [] };
      cyclicObject.a.push(cyclicObject);

      setup(cyclicObject);
      spec.detectChanges();
      assertError();
    });
  });

  withDefaultZone("Australia/Perth", () => {
    describe("DateTime input with implicit timezone", () => {
      let dateTime: DateTime;

      beforeEach(() => {
        dateTime = modelData.dateTime().setZone(modelData.timezone().identifier);

        spyOn(dateTime, "toISO").and.callFake(() => "toISO");
        setup(dateTime);
        spec.detectChanges();
      });

      it("should handle DateTime value with implicit timezone", () => {
        expect(getElement.values()).toHaveLength(1);
        expect(getElement.zonedDateTime()).toHaveLength(1);
      });

      it("should display DateTime value with implicit timezone", () => {
        const value = getElement.zonedDateTime()[0];
        const expectedValue = dateTime.toFormat("yyyy-MM-dd HH:mm:ss");

        expect(value).toHaveExactTrimmedText(expectedValue);
      });
    });
  });

  withDefaultZone(null, () => {
    describe("DateTime input without zone", () => {
      let dateTime: DateTime;

      beforeEach(() => {
        dateTime = DateTime.fromISO("2020-10-10T00:00:00");

        spyOn(dateTime, "toISO").and.callFake(() => "toISO");
        setup(dateTime);
        spec.detectChanges();
      });

      // date/time's without a timezone should be localized to the users local timezone
      // while date/time's with an implicit timezone should be localized to the set timezone
      it("should handle DateTime value without timezone", () => {
        expect(getElement.values()).toHaveLength(1);
        expect(getElement.localizedDateTime()).toHaveLength(1);
      });

      it("should display DateTime value without timezone", () => {
        const value = getElement.localizedDateTime()[0];
        const expectedValue = dateTime.toFormat("yyyy-MM-dd HH:mm:ss");

        expect(value).toHaveExactTrimmedText(expectedValue);
      });
    });
  });

  describe("Duration input", () => {
    let duration: Duration;

    beforeEach(() => {
      duration = Duration.fromObject({ hours: 1, minutes: 10, seconds: 50 });
      setup(duration);
      spec.detectChanges();
    });

    it("should handle Duration value", () => {
      // because we display the ISO 8601 format and the humanized format in brackets
      // we expect there to be two duration elements with one shard value
      expect(getElement.values().length).toBe(1);
      expect(getElement.duration().length).toBe(2);
    });

    it("should display Duration value", () => {
      const value = getElement.duration()[0];
      expect(value).toHaveExactTrimmedText("PT1H10M50S");
    });
  });

  describe("array input", () => {
    it("should handle array values", () => {
      setup(["test 1", 2, { testing: "value" }]);
      spec.detectChanges();
      expect(getElement.values().length).toBe(3);
      expect(getElement.normal().length).toBe(2);
      expect(getElement.code().length).toBe(1);
    });

    it("should handle empty array", () => {
      setup([]);
      spec.detectChanges();
      const values = getElement.values();
      expect(getElement.values().length).toBe(1);
      expect(values[0]).toHaveExactText("(no value)");
    });

    it("should display array values", () => {
      setup(["test 1", 2, { testing: "value" }]);
      spec.detectChanges();
      const values = getElement.values();
      expect(values[0]).toHaveExactText("test 1");
      expect(values[1]).toHaveExactText("2");
      expect(values[2].innerText).toContain(objectToString({ testing: "value" }));
    });
  });

  describe("Blob input", () => {
    function setBlob(text: string, error?: string) {
      let resolve: () => void;
      const promise = new Promise<void>((_resolve) => {
        resolve = _resolve;
      });

      const blob = new Blob([text], { type: "text/plain" });
      spyOn(blob, "text").and.callFake(
        () =>
          new Promise<string>((_resolve, _reject) => {
            resolve();

            if (text) {
              _resolve(text);
            } else {
              _reject(error);
            }
          }),
      );

      setup(blob);
      spec.detectChanges();
      return promise;
    }

    it("should display loading while blob incomplete", async () => {
      const blob = new Blob([]);
      spyOn(blob, "text").and.stub();
      setup(blob);
      spec.detectChanges();
      assertLoading();
    });

    it("should hide loading when blob complete", async () => {
      await setBlob("testing");
      spec.detectChanges();
      assertNotLoading();
    });

    it("should handle Blob value", async () => {
      await setBlob("testing");
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.code().length).toBe(1);
    });

    it("should display text output", async () => {
      await setBlob("testing");
      spec.detectChanges();
      const value = getElement.code()[0];
      expect(value).toHaveExactText("testing");
    });

    it("should handle error output", async () => {
      await setBlob(undefined, "failure");
      spec.detectChanges();
      assertError();
    });
  });

  describe("AbstractModel input", () => {
    function createModel(data: any, link: () => string = () => "", toString?: (model) => string) {
      class MockModel extends AbstractModel {
        public kind = "Mock Model";
        public get viewUrl() {
          return link();
        }
        public toString = () => (toString ? toString(this) : super.toString());
      }
      return new MockModel(data);
    }

    it("should display loading for an unresolved model", () => {
      setup(UnresolvedModel.one);
      spec.detectChanges();
      assertLoading();
    });

    it("should create a model link", () => {
      setup(createModel({ id: 1 }));
      spec.detectChanges();
      expect(spec.query("baw-model-link")).toBeTruthy();
    });

    it("should display ghost user", () => {
      setup(User.getUnknownUser(undefined));
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.ghost().length).toBe(1);
    });

    it("should display abstract model", () => {
      setup(createModel({ id: 1 }));
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.model().length).toBe(1);
    });
  });

  describe("Observable input", () => {
    function createObservable(shouldReturn: boolean, output?: any, error?: any) {
      if (!shouldReturn) {
        return new Subject();
      } else if (output) {
        return new BehaviorSubject(output);
      } else {
        const subject = new Subject();
        subject.error(error);
        return subject;
      }
    }

    it("should display loading", () => {
      setup(createObservable(false));
      spec.detectChanges();
      assertLoading();
    });

    it("should hide loading when observable returns", () => {
      setup(createObservable(true, "value"));
      spec.detectChanges();
      assertNotLoading();
    });

    it("should hide loading when observable errors", () => {
      setup(createObservable(true, undefined, { error: true }));
      spec.detectChanges();
      assertNotLoading();
    });

    it("should handle single model value", () => {
      setup(createObservable(true, "value"));
      spec.detectChanges();
      const values = getElement.normal();
      expect(values.length).toBe(1);
      expect(values[0]).toHaveExactText("value");
    });

    it("should handle multiple model values", () => {
      setup(createObservable(true, ["test 1", 2, { testing: "value" }]));
      spec.detectChanges();

      const values = getElement.values();
      expect(values[0]).toHaveExactText("test 1");
      expect(values[1]).toHaveExactText("2");
      expect(values[2].innerText).toContain(objectToString({ testing: "value" }));
    });

    it("should display error output", () => {
      setup(createObservable(true, undefined, { error: true }));
      spec.detectChanges();
      assertError();
    });
  });

  describe("image input", () => {
    function setImageSpy(expectation?: (src: string) => void) {
      spec.component["isImage"] = jasmine
        .createSpy()
        .and.callFake((src: string, onload: () => void, __: () => void) => {
          expectation?.(src);
          onload();
        });
    }

    it("should handle localhost image URL", () => {
      setup(`${assetRoot}/test/test.png`);
      setImageSpy((src) => expect(src).toBe(`${assetRoot}/test/test.png`));
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.image().length).toBe(1);
    });

    it("should handle external image URL", () => {
      setup("https://staging.ecosounds.org/test.png");
      setImageSpy((src) => expect(src).toBe("https://staging.ecosounds.org/test.png"));
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.image().length).toBe(1);
    });

    it("should display image", () => {
      setup(`${assetRoot}/test/test.png`);
      setImageSpy();
      spec.detectChanges();
      const value = getElement.image()[0];
      expect(value).toHaveImage(`${websiteHttpUrl}${assetRoot}/test/test.png`, {
        alt: "model image alt",
      });
    });
  });

  describe("imageUrls input", () => {
    it("should handle imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.image().length).toBe(1);
    });

    it("should display imageUrls array", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      setup(imageUrls);
      spec.detectChanges();
      const value = getElement.image()[0];
      expect(value).toHaveImage(imageUrls[0].url, { alt: "model image alt" });
    });

    it("should display multiple value imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      const value = getElement.image()[0];
      expect(value).toHaveImage(imageUrls[0].url, { alt: "model image alt" });
    });

    it("should handle invalid imageUrl", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      const value = getElement.image()[0];
      value.onerror("unit test");
      spec.detectChanges();
      expect(value).toHaveImage(imageUrls[1].url, { alt: "model image alt" });
    });
  });
});
