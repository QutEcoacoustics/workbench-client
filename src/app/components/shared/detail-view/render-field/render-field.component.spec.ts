import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import {
  AbstractModel,
  unknownViewUrl,
  UnresolvedModel,
} from "@models/AbstractModel";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { assetRoot } from "@services/config/config.service";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { CheckboxModule } from "@shared/checkbox/checkbox.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { ModelLinkModule } from "@shared/model-link/model-link.module";
import { modelData } from "@test/helpers/faker";
import { assertImage, assertUrl } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Subject } from "rxjs";
import { ModelView, RenderFieldComponent } from "./render-field.component";

describe("RenderFieldComponent", () => {
  let spec: SpectatorHost<RenderFieldComponent>;
  const createComponent = createHostFactory({
    component: RenderFieldComponent,
    declarations: [CheckboxComponent],
    imports: [
      RouterTestingModule,
      CheckboxModule,
      ModelLinkModule,
      LoadingModule,
      DirectivesModule,
      AuthenticatedImageModule,
      MockBawApiModule,
    ],
  });

  const getElement = {
    loading: () => getElement.normal(),
    code: () => spec.queryAll<HTMLPreElement>("dl #code"),
    normal: () => spec.queryAll<HTMLParagraphElement>("dl #plain"),
    model: () =>
      spec.queryAll<HTMLAnchorElement | HTMLSpanElement>("dl #abstract-model"),
    image: () => spec.queryAll<HTMLImageElement>("dl #image"),
    checkbox: () => spec.queryAll<HTMLElement>("dl #checkbox"),
    values: () =>
      spec.queryAll("dl").map((el) => el.firstElementChild as HTMLElement),
  };

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
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should display undefined value", () => {
      setup(undefined);
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value.innerText.trim()).toBe("(no value)");
    });
  });

  describe("string input", () => {
    function spyOnIsImage() {
      spec.component["isImage"] = jasmine
        .createSpy()
        .and.callFake((_, __, onerror: () => void) => onerror());
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
      expect(value.innerText.trim()).toBe("");
    });

    it("should display string value", () => {
      setup("testing");
      spyOnIsImage();
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value.innerText.trim()).toBe("testing");
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
      expect(value.innerText.trim()).toBe("0");
    });

    it("should display number value", () => {
      setup(1);
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value.innerText.trim()).toBe("1");
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
      expect(value.innerText.trim()).toBe("{}");
    });

    it("should display object value", () => {
      setup({ value1: 42, value2: "test" });
      spec.detectChanges();
      const value = getElement.code()[0];
      expect(value.innerText.trim()).toBe('{"value1":42,"value2":"test"}');
    });

    it("should display object error", () => {
      // Create cyclic object should fail JSON.stringify
      const cyclicObject = { a: [] };
      cyclicObject.a.push(cyclicObject);

      setup(cyclicObject);
      spec.detectChanges();
      const value = getElement.code()[0];
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
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should call toRelative", () => {
      expect(dateTime.toRelative).toHaveBeenCalled();
    });

    it("should call toISO", () => {
      expect(dateTime.toISO).toHaveBeenCalled();
    });

    it("should display DateTime value", () => {
      const value = getElement.normal()[0];
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
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should display Duration value", () => {
      const value = getElement.normal()[0];
      expect(value.innerText.trim()).toBe(
        "PT1H10M50S (1 hour, 10 minutes, 50 seconds)"
      );
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
      expect(values[0].innerText.trim()).toBe("(no value)");
    });

    it("should display array values", () => {
      setup(["test 1", 2, { testing: "value" }]);
      spec.detectChanges();
      const values = getElement.values();
      expect(values[0].innerText.trim()).toBe("test 1");
      expect(values[1].innerText.trim()).toBe("2");
      expect(values[2].innerText.trim()).toBe('{"testing":"value"}');
    });
  });

  describe("Blob input", () => {
    function setBlob(text: string, error?: string) {
      const blob = new Blob([text], { type: "text/plain" });

      if (text) {
        spyOn(blob, "text").and.callFake(async () => text);
      } else if (error) {
        spyOn(blob, "text").and.callFake(
          () => new Promise<string>((resolve, reject) => reject(error))
        );
      } else {
        spyOn(blob, "text").and.stub();
      }

      setup(blob);
      spec.detectChanges();
    }

    it("should display loading while blob incomplete", () => {
      setBlob(undefined);
      const value = getElement.loading()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should hide loading when blob complete", () => {
      setBlob("testing");
      const value = getElement.loading()[0];
      expect(value).toBeFalsy();
    });

    it("should handle Blob value", () => {
      setBlob("testing");
      expect(getElement.values().length).toBe(1);
      expect(getElement.code().length).toBe(1);
    });

    it("should display text output", () => {
      setBlob("testing");
      const value = getElement.code()[0];
      expect(value.innerText.trim()).toBe("testing");
    });

    it("should handle error output", () => {
      setBlob(undefined, "failure");
      spec.detectChanges();
      const value = getElement.code()[0];
      expect(value.innerText.trim()).toBe("(error)");
    });
  });

  describe("AbstractModel input", () => {
    const throwError = () => {
      throw new Error();
    };

    function createModel(
      data: any,
      link: () => string = () => "",
      toString?: (model) => string
    ) {
      class MockModel extends AbstractModel {
        public kind = "Mock Model";
        public get viewUrl() {
          return link();
        }
        public toString = () => (toString ? toString(this) : super.toString());
      }
      return new MockModel(data);
    }

    it("should handle unresolved model", () => {
      setup(UnresolvedModel.one);
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.normal().length).toBe(1);
    });

    it("should display unresolved model", () => {
      setup(UnresolvedModel.one);
      spec.detectChanges();
      const value = getElement.normal()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should handle abstract model", () => {
      setup(createModel({ id: 1 }));
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.model().length).toBe(1);
    });

    it("should display default model toString()", () => {
      setup(createModel({ id: 1 }));
      spec.detectChanges();
      const value = getElement.model()[0];
      expect(value.innerText.trim()).toBe("Mock Model: 1");
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
      const value = getElement.model()[0];
      expect(value.innerText.trim()).toBe("custom model");
    });

    it("should display model if viewUrl throws error", () => {
      setup(
        createModel(
          { id: 1, name: "custom model" },
          throwError,
          (model) => model.name
        )
      );
      spec.detectChanges();
      const value = getElement.model()[0];
      expect(value.innerText.trim()).toBe("custom model");
    });

    it("should create model link if viewUrl is valid", () => {
      setup(createModel({ id: 1 }, () => "/broken_link"));
      spec.detectChanges();
      const value = getElement.model()[0];
      expect(value).toBeInstanceOf(HTMLAnchorElement);
      assertUrl(value, "/broken_link");
    });

    it("should not create model link if viewUrl returns unknownViewUrl", () => {
      setup(createModel({ id: 1 }, () => unknownViewUrl));
      spec.detectChanges();
      const value = getElement.model()[0];
      expect(value).toBeInstanceOf(HTMLSpanElement);
    });

    it("should not create model link if viewUrl throws error", () => {
      setup(createModel({ id: 1 }, throwError));
      spec.detectChanges();
      const value = getElement.model()[0];
      expect(value).toBeInstanceOf(HTMLSpanElement);
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
      const value = getElement.loading()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should hide loading when observable returns", () => {
      setup(createObservable(true, "value"));
      spec.detectChanges();
      const value = getElement.loading()[0];
      expect(value.innerText.trim()).not.toBe("(loading)");
    });

    it("should hide loading when observable errors", () => {
      setup(createObservable(true, undefined, { error: true }));
      spec.detectChanges();
      const value = getElement.loading()[0];
      expect(value.innerText.trim()).not.toBe("(loading)");
    });

    it("should handle single model value", () => {
      setup(createObservable(true, "value"));
      spec.detectChanges();
      const values = getElement.normal();
      expect(values.length).toBe(1);
      const value = values[0];
      expect(value.innerText.trim()).toBe("value");
    });

    it("should handle multiple model values", () => {
      setup(createObservable(true, ["test 1", 2, { testing: "value" }]));
      spec.detectChanges();

      const values = getElement.values();
      expect(values[0].innerText.trim()).toBe("test 1");
      expect(values[1].innerText.trim()).toBe("2");
      expect(values[2].innerText.trim()).toBe('{"testing":"value"}');
    });

    it("should display error output", () => {
      setup(createObservable(true, undefined, { error: true }));
      spec.detectChanges();
      const value = getElement.loading()[0];
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
      expect(getElement.values().length).toBe(1);
      expect(getElement.image().length).toBe(1);
    });

    it("should handle external image URL", () => {
      setup("https://staging.ecosounds.org/test.png");
      setImageSpy((src) =>
        expect(src).toBe("https://staging.ecosounds.org/test.png")
      );
      spec.detectChanges();
      expect(getElement.values().length).toBe(1);
      expect(getElement.image().length).toBe(1);
    });

    it("should display image", () => {
      setup(`${assetRoot}/test/test.png`);
      setImageSpy();
      spec.detectChanges();
      const value = getElement.image()[0];
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
      expect(getElement.values().length).toBe(1);
      expect(getElement.image().length).toBe(1);
    });

    it("should display imageUrls array", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      setup(imageUrls);
      spec.detectChanges();
      const value = getElement.image()[0];
      assertImage(value, imageUrls[0].url, "model image alt");
    });

    it("should display multiple value imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      const value = getElement.image()[0];
      assertImage(value, imageUrls[0].url, "model image alt");
    });

    it("should handle invalid imageUrl", () => {
      const imageUrls = modelData.imageUrls();
      setup(imageUrls);
      spec.detectChanges();
      const value = getElement.image()[0];
      value.onerror("unit test");
      spec.detectChanges();
      assertImage(value, imageUrls[1].url, "model image alt");
    });
  });
});
