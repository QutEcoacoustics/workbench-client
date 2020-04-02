import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Subject } from "rxjs";
import { humanizeDuration } from "src/app/interfaces/apiInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { assertRoute } from "src/testHelpers";
import { ListDetailValue } from "../question-answer.component";
import { AnswerComponent } from "./answer.component";

describe("AnswerComponent", () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;

  function getLoadingElement() {
    return fixture.nativeElement.querySelector("#loading");
  }

  function getChildAnswers() {
    return fixture.nativeElement.querySelectorAll("app-answer");
  }

  function getRouteValues() {
    return fixture.nativeElement.querySelectorAll("a");
  }

  function getCodeValues() {
    return fixture.nativeElement.querySelectorAll("pre");
  }

  function getNormalValues() {
    return fixture.nativeElement.querySelectorAll("span");
  }

  function getValues() {
    return fixture.nativeElement.querySelectorAll("a, pre, span");
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
  });

  describe("routing", () => {
    it("should handle undefined route", () => {
      component.detail = { value: "testing", route: undefined };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getRouteValues().length).toBe(0);
    });

    it("should handle route", () => {
      component.detail = { value: "testing", route: "/broken_link" };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getRouteValues().length).toBe(1);
    });

    it("should insert correct route", () => {
      component.detail = { value: "testing", route: "/broken_link" };
      fixture.detectChanges();

      const value = getRouteValues()[0];
      assertRoute(value, "/broken_link");
    });

    // TODO string, number, datetime, duration
  });

  describe("undefined input", () => {
    it("should handle undefined value", () => {
      component.detail = { value: undefined };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display undefined value", () => {
      component.detail = { value: undefined };
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("(no value)");
    });
  });

  describe("string input", () => {
    it("should handle string value", () => {
      component.detail = { value: "testing" };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display string value", () => {
      component.detail = { value: "testing" };
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("testing");
    });
  });

  describe("number input", () => {
    it("should handle number value", () => {
      component.detail = { value: 1 };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display zero number value", () => {
      component.detail = { value: 0 };
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("0");
    });

    it("should display number value", () => {
      component.detail = { value: 1 };
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("1");
    });
  });

  describe("object input", () => {
    it("should handle object value", () => {
      component.detail = { value: { testing: 42 } };
      fixture.detectChanges();

      expect(getValues().length).toBe(1);
      expect(getCodeValues().length).toBe(1);
    });

    it("should display empty object value", () => {
      component.detail = { value: {} };
      fixture.detectChanges();

      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("{}");
    });

    it("should display object value", () => {
      component.detail = { value: { value1: 42, value2: "test" } };
      fixture.detectChanges();

      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe('{"value1":42,"value2":"test"}');
    });

    it("should display object error", () => {
      // Create cyclic object should fail JSON.stringify
      const cyclicObject = { a: [] };
      cyclicObject.a.push(cyclicObject);

      component.detail = { value: cyclicObject };
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

      component.detail = { value: dateTime };
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
      component.detail = { value: duration };
      fixture.detectChanges();
    });

    it("should handle Duration value", () => {
      expect(getValues().length).toBe(1);
      expect(getNormalValues().length).toBe(1);
    });

    it("should display Duration value", () => {
      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe(humanizeDuration(duration));
    });
  });

  // TODO Replace with tests that doesn't require intercepting function calls
  describe("Blob input", () => {
    const compatibleBrowser = new Blob(["compatibility"], {
      type: "text/plain"
    });

    if (!compatibleBrowser.text) {
      return;
    }

    function setBlob(promise: Promise<string>) {
      const blob = new Blob(["testing"], { type: "text/plain" });
      spyOn(blob, "text").and.callFake(() => promise);
      component.detail = { value: blob };
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }

    it("should display loading while blob incomplete", fakeAsync(() => {
      setBlob(new Promise(() => {}));
      const value = getLoadingElement();
      expect(value.innerText.trim()).toBe("(loading)");
    }));

    it("should hide loading when blob complete", fakeAsync(() => {
      setBlob(
        new Promise(resolve => {
          resolve("testing");
        })
      );
      const value = getLoadingElement();
      expect(value).toBeFalsy();
    }));

    it("should handle Blob value", fakeAsync(() => {
      setBlob(
        new Promise(resolve => {
          resolve("testing");
        })
      );
      expect(getValues().length).toBe(1);
      expect(getCodeValues().length).toBe(1);
    }));

    it("should display text output", fakeAsync(() => {
      setBlob(
        new Promise(resolve => {
          resolve("testing");
        })
      );
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("testing");
    }));

    it("should handle error output", fakeAsync(() => {
      setBlob(
        new Promise((_, reject) => {
          reject();
        })
      );
      const value = getCodeValues()[0];
      expect(value.innerText.trim()).toBe("(error)");
    }));
  });

  describe("array input", () => {
    it("should handle array values", () => {
      component.detail = {
        value: [
          { value: "test 1" },
          { value: 2 },
          { value: { testing: "value" } }
        ]
      };
      fixture.detectChanges();

      expect(getValues().length).toBe(3);
      expect(getNormalValues().length).toBe(2);
      expect(getCodeValues().length).toBe(1);
    });

    it("should display array values", () => {
      component.detail = {
        value: [
          { value: "test 1" },
          { value: 2 },
          { value: { testing: "value" } }
        ]
      };
      fixture.detectChanges();

      const values = getValues();
      expect(values[0].innerText.trim()).toBe("test 1");
      expect(values[1].innerText.trim()).toBe("2");
      expect(values[2].innerText.trim()).toBe('{"testing":"value"}');
    });

    it("should handle array values with routes", () => {
      component.detail = {
        value: [
          { value: "test 1", route: "/broken_link_1" },
          { value: 2, route: "/broken_link_2" },
          { value: { testing: "value" } }
        ]
      };
      fixture.detectChanges();

      const values = getRouteValues();
      expect(values.length).toBe(2);
      assertRoute(values[0], "/broken_link_1");
      assertRoute(values[1], "/broken_link_2");
    });
  });

  describe("observable input", () => {
    it("should display loading while observable incomplete", () => {
      component.detail = {
        value: new Subject<ListDetailValue>()
      };
      fixture.detectChanges();

      const value = getLoadingElement();
      expect(value.innerText.trim()).toBe("(loading)");
    });

    it("should hide loading when observable complete", () => {
      component.detail = {
        value: new BehaviorSubject<ListDetailValue>({ value: "testing" })
      };
      fixture.detectChanges();

      const value = getLoadingElement();
      expect(value).toBeFalsy();
    });

    it("should handle single value", () => {
      component.detail = {
        value: new BehaviorSubject<ListDetailValue>({ value: "testing" })
      };
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("testing");
    });

    it("should handle array value", () => {
      component.detail = {
        value: new BehaviorSubject<ListDetailValue>({
          value: [
            { value: "test 1" },
            { value: 2 },
            { value: { testing: "value" } }
          ]
        })
      };
      fixture.detectChanges();

      const values = getValues();
      expect(values.length).toBe(3);
    });

    it("should handle error output", () => {
      const subject = new Subject<ListDetailValue>();
      subject.error({
        status: 401,
        message: "Unauthorized"
      } as ApiErrorDetails);
      component.detail = {
        value: subject
      };
      fixture.detectChanges();

      const value = getNormalValues()[0];
      expect(value.innerText.trim()).toBe("(error)");
    });
  });
});
