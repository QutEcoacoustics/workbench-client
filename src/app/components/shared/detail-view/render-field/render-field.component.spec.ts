import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { User } from "@models/User";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/config/config.service";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { CheckboxModule } from "@shared/checkbox/checkbox.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { modelData } from "@test/helpers/faker";
import { assertImage } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Subject } from "rxjs";
import { ModelLinkComponent } from "../model-link/model-link.component";
import { ModelView, RenderFieldComponent } from "./render-field.component";

describe("RenderFieldComponent", () => {
  let spec: SpectatorHost<RenderFieldComponent>;
  const createComponent = createHostFactory({
    component: RenderFieldComponent,
    declarations: [CheckboxComponent, ModelLinkComponent],
    imports: [
      AuthenticatedImageModule,
      CheckboxModule,
      DirectivesModule,
      LoadingModule,
      MockBawApiModule,
      RouterTestingModule,
      PipesModule,
    ],
  });

  const getElement = {
    code: () => spec.queryAll<HTMLPreElement>("dl #code"),
    normal: () => spec.queryAll<HTMLParagraphElement>("dl #plain"),
    model: () => spec.queryAll<HTMLSpanElement>("#model"),
    ghost: () => spec.queryAll<HTMLSpanElement>("#ghost"),
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

  function assertNotLoading(value?: HTMLElement) {
    value ??= getElement.normal()[0];

    if (!value) {
      expect(value).toBeFalsy();
    } else {
      expect(value).not.toContainText("(loading)");
    }
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
      expect(value).toHaveExactText("{}");
    });

    it("should display object value", () => {
      setup({ value1: 42, value2: "test" });
      spec.detectChanges();
      const value = getElement.code()[0];
      expect(value).toHaveExactText('{"value1":42,"value2":"test"}');
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
      expect(value).toHaveExactText("toISO (toRelative)");
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
      expect(value).toHaveExactText(
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
      expect(values[0]).toHaveExactText("(no value)");
    });

    it("should display array values", () => {
      setup(["test 1", 2, { testing: "value" }]);
      spec.detectChanges();
      const values = getElement.values();
      expect(values[0]).toHaveExactText("test 1");
      expect(values[1]).toHaveExactText("2");
      expect(values[2]).toHaveExactText('{"testing":"value"}');
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
          })
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
      setup(User.unknownUser);
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
      expect(values[2]).toHaveExactText('{"testing":"value"}');
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
