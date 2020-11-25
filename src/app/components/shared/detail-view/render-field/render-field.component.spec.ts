import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { assetRoot } from "@services/app-config/app-config.service";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { modelData } from "@test/helpers/faker";
import { assertImage, assertRoute } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Subject } from "rxjs";
import { ModelView, RenderFieldComponent } from "./render-field.component";

describe("RenderFieldComponent", () => {
  let spec: SpectatorHost<RenderFieldComponent>;
  const createComponent = createHostFactory({
    component: RenderFieldComponent,
    declarations: [CheckboxComponent],
    imports: [RouterTestingModule, AuthenticatedImageModule, MockBawApiModule],
  });

  function getLoadingElements() {
    return getNormalValues();
  }

  function getCodeValues() {
    return spec.queryAll<HTMLPreElement>("dl pre");
  }

  function getNormalValues() {
    return spec.queryAll<HTMLParagraphElement>("dl p");
  }

  function getModelValues() {
    return spec.queryAll<HTMLAnchorElement>("dl a");
  }

  function getImageValues() {
    return spec.queryAll<HTMLImageElement>("dl img");
  }

  function getCheckboxValues() {
    return spec.queryAll<HTMLElement>("dl baw-checkbox");
  }

  function getValues() {
    return spec.queryAll("dl").map((el) => el.firstElementChild as HTMLElement);
  }

  function setup(value: ModelView) {
    spec = createComponent(
      '<baw-render-field [value]="value"></baw-render-field>',
      { detectChanges: false, hostProps: { value } }
    );
  }

  describe("undefined input", () => {
    it("should handle undefined value", () => {
      setup(undefined);
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display undefined value", () => {
      setup(undefined);
      spec.detectChanges();
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("(no value)");
    });
  });

  describe("string input", () => {
    function spyOnIsImage() {
      spec.component[
        "isImage"
      ] = jasmine
        .createSpy()
        .and.callFake((_, __, onerror: () => void) => onerror());
    }

    it("should handle string value", () => {
      setup("testing");
      spyOnIsImage();
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display empty string value", () => {
      setup("");
      spyOnIsImage();
      spec.detectChanges();
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("");
    });

    it("should display string value", () => {
      setup("testing");
      spyOnIsImage();
      spec.detectChanges();
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("testing");
    });
  });

  describe("number input", () => {
    it("should handle number value", () => {
      setup(1);
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display zero number value", () => {
      setup(0);
      spec.detectChanges();
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("0");
    });

    it("should display number value", () => {
      setup(1);
      spec.detectChanges();
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("1");
    });
  });

  describe("checkbox input", () => {
    it("should handle true input", () => {
      setup(true);
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getCheckboxValues().length).toBe(1);
    });

    it("should display true input", () => {
      setup(true);
      spec.detectChanges();
      const value = getCheckboxValues()[0].querySelector("input");
      expect(value.checked).toBeTruthy();
      expect(value.disabled).toBeTruthy();
    });

    it("should handle false input", () => {
      setup(false);
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getCheckboxValues().length).toBe(1);
    });

    it("should display false input", () => {
      setup(false);
      spec.detectChanges();
      const value = getCheckboxValues()[0].querySelector("input");
      expect(value.checked).toBeFalsy();
      expect(value.disabled).toBeTruthy();
    });
  });

  describe("object input", () => {
    it("should handle object value", () => {
      setup({ testing: 42 });
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getCodeValues().length).toBe(1);
    });

    it("should display empty object value", () => {
      setup({});
      spec.detectChanges();
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("{}");
    });

    it("should display object value", () => {
      setup({ value1: 42, value2: "test" });
      spec.detectChanges();
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe('{"value1":42,"value2":"test"}');
    });

    it("should display object error", () => {
      // Create cyclic object should fail JSON.stringify
      const cyclicObject = { a: [] };
      cyclicObject.a.push(cyclicObject);

      setup(cyclicObject);
      spec.detectChanges();
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("(error)");
    });
  });

  describe("DateTime input", () => {
    let dateTime: DateTime;

    beforeEach(() => {
      dateTime = DateTime.local();
      spyOn(dateTime, "toRelative").and.callFake(() => "toRelative");
      spyOn(dateTime, "toISO").and.callFake(() => "toISO");
      setup(dateTime);
      spec.detectChanges();
    });

    it("should handle DateTime value", () => {
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should call toRelative", () => {
      expect(dateTime.toRelative).toHaveBeenCalled();
    });

    it("should call toISO", () => {
      expect(dateTime.toISO).toHaveBeenCalled();
    });

    it("should display DateTime value", () => {
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("toISO (toRelative)");
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
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display Duration value", () => {
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe(
        "PT1H10M50S (1 hour, 10 minutes, 50 seconds)"
      );
    });
  });

  describe("array input", () => {
    it("should handle array values", () => {
      setup(["test 1", 2, { testing: "value" }]);
      spec.detectChanges();
      expect(getValues().length).toBe(3);
      expect(getNormalValues().length).toBe(2);
      expect(getCodeValues().length).toBe(1);
    });

    it("should handle empty array", () => {
      setup([]);
      spec.detectChanges();
      const values = getValues();
      expect(getValues().length).toBe(1);
      expect(values[0].innerText.trim()).toBe("(no value)");
    });

    it("should display array values", () => {
      setup(["test 1", 2, { testing: "value" }]);
      spec.detectChanges();
      const values = getValues();
      expect(values[0].innerText.trim()).toBe("test 1");
      expect(values[1].innerText.trim()).toBe("2");
      expect(values[2].innerText.trim()).toBe('{"testing":"value"}');
    });
  });

  describe("Blob input", () => {
    let spy: jasmine.SpyObj<FileReader>;

    function setBlob(shouldReturn: boolean, text?: string) {
      spy = jasmine.createSpyObj("FileReader", [
        "readAsText",
        "addEventListener",
        "abort",
        "onerror",
      ]);
      spy.readAsText.and.stub();

      if (shouldReturn) {
        spy.addEventListener.and.callFake(
          (_, listener: (...args: any[]) => void) =>
            listener({ target: { result: text } })
        );
      }

      spyOn(window, "FileReader").and.returnValue(spy);
      setup(new Blob([text], { type: "text/plain" }));
      spec.detectChanges();
    }

    it("should display loading while blob incomplete", () => {
      setBlob(false);
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should hide loading when blob complete", () => {
      setBlob(true, "testing");
      const value = getLoadingElements()[0];
      expect(value).toBeFalsy();
    });

    it("should handle Blob value", () => {
      setBlob(true, "testing");
      expect(getValues().length).toBe(1);
      expect(getCodeValues().length).toBe(1);
    });

    it("should display text output", () => {
      setBlob(true, "testing");
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("testing");
    });

    it("should handle error output", () => {
      setBlob(true, "testing");
      spy.onerror(undefined);
      spec.detectChanges();
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("(error)");
    });
  });

  describe("AbstractModel input", () => {
    function createModel(
      data: any,
      link: string = "",
      toString?: (model) => string
    ) {
      class MockModel extends AbstractModel {
        public kind = "MockModel";
        public viewUrl = link;
        public toString = () => (toString ? toString(this) : super.toString());
      }

      return new MockModel(data);
    }

    it("should handle unresolved model", () => {
      setup(UnresolvedModel.one);
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display unresolved model", () => {
      setup(UnresolvedModel.one);
      spec.detectChanges();
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should handle abstract model", () => {
      setup(createModel({ id: 1 }));
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getModelValues().length).toBe(1);
    });

    it("should display default model toString()", () => {
      setup(createModel({ id: 1 }));
      spec.detectChanges();
      const value = getModelValues()[0];
      expect(value.innerText.trim()).toBe("MockModel: 1");
    });

    it("should display custom model toString()", () => {
      setup(
        createModel(
          { id: 1, name: "custom model" },
          undefined,
          (model) => model.name
        )
      );
      spec.detectChanges();
      const value = getModelValues()[0];
      expect(value.innerText.trim()).toBe("custom model");
    });

    it("should create model link", () => {
      setup(createModel({ id: 1 }, "/broken_link"));
      spec.detectChanges();
      const value = getModelValues()[0];
      assertRoute(value, "/broken_link");
    });
  });

  describe("Observable input", () => {
    function createObservable(
      shouldReturn: boolean,
      output?: any,
      error?: any
    ) {
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
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should hide loading when observable returns", () => {
      setup(createObservable(true, "value"));
      spec.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).not.toBe("(loading)");
    });

    it("should hide loading when observable errors", () => {
      setup(createObservable(true, undefined, { error: true }));
      spec.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).not.toBe("(loading)");
    });

    it("should handle single model value", () => {
      setup(createObservable(true, "value"));
      spec.detectChanges();
      const values = getNormalValues();
      expect(values.length).toBe(1);
      const value = values[0];
      expect(value.innerText.trim()).toBe("value");
    });

    it("should handle multiple model values", () => {
      setup(createObservable(true, ["test 1", 2, { testing: "value" }]));
      spec.detectChanges();

      const values = getValues();
      expect(values[0].innerText.trim()).toBe("test 1");
      expect(values[1].innerText.trim()).toBe("2");
      expect(values[2].innerText.trim()).toBe('{"testing":"value"}');
    });

    it("should display error output", () => {
      setup(createObservable(true, undefined, { error: true }));
      spec.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).toBe("(error)");
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
      expect(getValues().length).toBe(1);
      expect(getImageValues().length).toBe(1);
    });

    it("should handle external image URL", () => {
      setup("https://staging.ecosounds.org/test.png");
      setImageSpy((src) =>
        expect(src).toBe("https://staging.ecosounds.org/test.png")
      );
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getImageValues().length).toBe(1);
    });

    it("should display image", () => {
      setup(`${assetRoot}/test/test.png`);
      setImageSpy();
      spec.detectChanges();
      const value = getImageValues()[0];
      assertImage(
        value,
        `${websiteHttpUrl}${assetRoot}/test/test.png`,
        "model image alt"
      );
    });
  });

  describe("imageUrls input", () => {
    it("should handle imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getImageValues().length).toBe(1);
    });

    it("should display imageUrls array", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      setup(imageUrls);
      spec.detectChanges();
      const value = getImageValues()[0];
      assertImage(value, imageUrls[0].url, "model image alt");
    });

    it("should display multiple value imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      const value = getImageValues()[0];
      assertImage(value, imageUrls[0].url, "model image alt");
    });

    it("should handle invalid imageUrl", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      const value = getImageValues()[0];
      value.onerror("unit test");
      spec.detectChanges();
      assertImage(value, imageUrls[1].url, "model image alt");
    });
  });
});
