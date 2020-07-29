import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { CheckboxComponent } from "@shared/checkbox/checkbox.component";
import { modelData } from "@test/helpers/faker";
import { assertImage, assertRoute } from "@test/helpers/html";
import { testBawServices } from "@test/helpers/testbed";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Subject } from "rxjs";
import { RenderFieldComponent } from "./render-field.component";

describe("RenderFieldComponent", () => {
  let component: RenderFieldComponent;
  let fixture: ComponentFixture<RenderFieldComponent>;

  function getLoadingElements() {
    return getNormalValues();
  }

  function getCodeValues(): NodeListOf<HTMLPreElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl pre");
  }

  function getNormalValues(): NodeListOf<HTMLParagraphElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl p");
  }

  function getModelValues(): NodeListOf<HTMLAnchorElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl a");
  }

  function getImageValues(): NodeListOf<HTMLImageElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl img");
  }

  function getCheckboxValues(): NodeListOf<HTMLElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll(
      "dl baw-checkbox"
    );
  }

  function getValues(): HTMLElement[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll("dl")
    ).map((el) => el.firstElementChild as HTMLElement);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenderFieldComponent, CheckboxComponent],
      imports: [
        RouterTestingModule,
        AuthenticatedImageModule,
        HttpClientTestingModule,
      ],
      providers: testBawServices,
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderFieldComponent);
    component = fixture.componentInstance;
  });

  describe("undefined input", () => {
    it("should handle undefined value", () => {
      component.value = undefined;
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display undefined value", () => {
      component.value = undefined;
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("(no value)");
    });
  });

  describe("string input", () => {
    beforeEach(() => {
      component["isImage"] = jasmine
        .createSpy()
        .and.callFake((_: string, __: () => void, onerror: () => void) => {
          onerror();
        });
    });

    it("should handle string value", () => {
      component.value = "testing";
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display string value", () => {
      component.value = "testing";
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("testing");
    });
  });

  describe("number input", () => {
    it("should handle number value", () => {
      component.value = 1;
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display zero number value", () => {
      component.value = 0;
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("0");
    });

    it("should display number value", () => {
      component.value = 1;
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("1");
    });
  });

  describe("checkbox input", () => {
    it("should handle true input", () => {
      component.value = true;
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getCheckboxValues().length).toBe(1);
    });

    it("should display true input", () => {
      component.value = true;
      fixture.detectChanges();

      const value = getCheckboxValues()[0].querySelector("input");
      expect(value.checked).toBeTruthy();
      expect(value.disabled).toBeTruthy();
    });

    it("should handle false input", () => {
      component.value = false;
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getCheckboxValues().length).toBe(1);
    });

    it("should display false input", () => {
      component.value = false;
      fixture.detectChanges();

      const value = getCheckboxValues()[0].querySelector("input");
      expect(value.checked).toBeFalsy();
      expect(value.disabled).toBeTruthy();
    });
  });

  describe("object input", () => {
    it("should handle object value", () => {
      component.value = { testing: 42 };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getCodeValues().length).toBe(1);
    });

    it("should display empty object value", () => {
      component.value = {};
      fixture.detectChanges();

      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("{}");
    });

    it("should display object value", () => {
      component.value = { value1: 42, value2: "test" };
      fixture.detectChanges();

      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe('{"value1":42,"value2":"test"}');
    });

    it("should display object error", () => {
      // Create cyclic object should fail JSON.stringify
      const cyclicObject = { a: [] };
      cyclicObject.a.push(cyclicObject);

      component.value = cyclicObject;
      fixture.detectChanges();

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

      component.value = dateTime;
      fixture.detectChanges();
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
      component.value = duration;
      fixture.detectChanges();
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
      component.value = ["test 1", 2, { testing: "value" }];
      fixture.detectChanges();

      expect(getValues().length).toBe(3);
      expect(getNormalValues().length).toBe(2);
      expect(getCodeValues().length).toBe(1);
    });

    it("should handle empty array", () => {
      component.value = [];
      fixture.detectChanges();

      const values = getValues();
      expect(getValues().length).toBe(1);
      expect(values[0].innerText.trim()).toBe("(no value)");
    });

    it("should display array values", () => {
      component.value = ["test 1", 2, { testing: "value" }];
      fixture.detectChanges();

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
          (_: string, listener: (...args: any[]) => void) => {
            listener({ target: { result: text } });
          }
        );
      }

      spyOn(window as any, "FileReader").and.returnValue(spy);
      const blob = new Blob([text], { type: "text/plain" });
      component.value = blob;
      fixture.detectChanges();
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
      fixture.detectChanges();

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
        public toString() {
          return toString ? toString(this) : super.toString();
        }
      }

      return new MockModel(data);
    }

    it("should handle unresolved model", () => {
      component.value = UnresolvedModel.one;
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display unresolved model", () => {
      component.value = UnresolvedModel.one;
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should handle abstract model", () => {
      component.value = createModel({ id: 1 });
      fixture.detectChanges();
      expect(getValues().length).toBe(1);
      expect(getModelValues().length).toBe(1);
    });

    it("should display default model toString()", () => {
      component.value = createModel({ id: 1 });
      fixture.detectChanges();
      const value = getModelValues()[0];
      expect(value.innerText.trim()).toBe("MockModel: 1");
    });

    it("should display custom model toString()", () => {
      component.value = createModel(
        { id: 1, name: "custom model" },
        undefined,
        (model) => model.name
      );
      fixture.detectChanges();
      const value = getModelValues()[0];
      expect(value.innerText.trim()).toBe("custom model");
    });

    it("should create model link", () => {
      component.value = createModel({ id: 1 }, "/broken_link");
      fixture.detectChanges();
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
      component.value = createObservable(false);
      fixture.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should hide loading when observable returns", () => {
      component.value = createObservable(true, "value");
      fixture.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).not.toBe("(loading)");
    });

    it("should hide loading when observable errors", () => {
      component.value = createObservable(true, undefined, { error: true });
      fixture.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).not.toBe("(loading)");
    });

    it("should handle single model value", () => {
      component.value = createObservable(true, "value");
      fixture.detectChanges();
      const values = getNormalValues();
      expect(values.length).toBe(1);
      const value = values[0];
      expect(value.innerText.trim()).toBe("value");
    });

    it("should handle multiple model values", () => {
      component.value = createObservable(true, [
        "test 1",
        2,
        { testing: "value" },
      ]);
      fixture.detectChanges();

      const values = getValues();
      expect(values[0].innerText.trim()).toBe("test 1");
      expect(values[1].innerText.trim()).toBe("2");
      expect(values[2].innerText.trim()).toBe('{"testing":"value"}');
    });

    it("should display error output", () => {
      component.value = createObservable(true, undefined, { error: true });
      fixture.detectChanges();
      const value = getLoadingElements()[0];
      expect(value.innerText.trim()).toBe("(error)");
    });
  });

  describe("image input", () => {
    it("should handle localhost image URL", () => {
      component["isImage"] = jasmine
        .createSpy()
        .and.callFake((src: string, onload: () => void, __: () => void) => {
          expect(src).toBe("/assets/test/test.png");
          onload();
        });

      component.value = "/assets/test/test.png";
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getImageValues().length).toBe(1);
    });

    it("should handle external image URL", () => {
      component["isImage"] = jasmine
        .createSpy()
        .and.callFake((src: string, onload: () => void, __: () => void) => {
          expect(src).toBe("https://staging.ecosounds.org/test.png");
          onload();
        });

      component.value = "https://staging.ecosounds.org/test.png";
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getImageValues().length).toBe(1);
    });

    it("should display image", () => {
      component["isImage"] = jasmine
        .createSpy()
        .and.callFake((_: string, onload: () => void, __: () => void) => {
          onload();
        });

      component.value = "/assets/test/test.png";
      fixture.detectChanges();

      const value = getImageValues()[0];
      assertImage(
        value,
        `http://${window.location.host}/assets/test/test.png`,
        "model image alt"
      );
    });
  });

  describe("imageUrls input", () => {
    it("should handle imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      component.value = imageUrls;
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getImageValues().length).toBe(1);
    });

    it("should display imageUrls array", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      component.value = imageUrls;
      fixture.detectChanges();

      const value = getImageValues()[0];
      assertImage(value, imageUrls[0].url, "model image alt");
    });

    it("should display multiple value imageUrls array", () => {
      const imageUrls = modelData.imageUrls();
      component.value = imageUrls;
      fixture.detectChanges();

      const value = getImageValues()[0];
      assertImage(value, imageUrls[0].url, "model image alt");
    });

    it("should handle invalid imageUrl", () => {
      const imageUrls = modelData.imageUrls();
      component.value = imageUrls;
      fixture.detectChanges();

      const value = getImageValues()[0];
      value.onerror("unit test");
      fixture.detectChanges();
      assertImage(value, imageUrls[1].url, "model image alt");
    });
  });
});
