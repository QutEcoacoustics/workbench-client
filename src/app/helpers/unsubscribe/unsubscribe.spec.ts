import { Subject } from "rxjs";
import { withUnsubscribe } from "./unsubscribe";

describe("WithUnsubscribe", () => {
  it("should accept empty base class", () => {
    class MockClass extends withUnsubscribe() {
      public test = "MockClass";
    }

    const mockClass = new MockClass();

    expect(mockClass).toBeTruthy();
    expect(mockClass.test).toBe("MockClass");
  });

  it("should accept custom class base class", () => {
    class MockBaseClass {
      public base = "MockBaseClass";
    }
    class MockClass extends withUnsubscribe(MockBaseClass) {
      public test = "Custom Test";
    }

    const mockClass = new MockClass();

    expect(mockClass).toBeTruthy();
    expect(mockClass.base).toBe("MockBaseClass");
    expect(mockClass.test).toBe("Custom Test");
  });

  it("should provide unsubscribe observable", () => {
    class MockClass extends withUnsubscribe() {}
    const mockClass = new MockClass();

    expect(mockClass["unsubscribe"]).toBeTruthy();
    expect(mockClass["unsubscribe"] instanceof Subject).toBeTrue();
  });

  it("should call next() when ngOnDestroy is called", () => {
    class MockClass extends withUnsubscribe() {}
    const mockClass = new MockClass();
    const spy = spyOn(mockClass["unsubscribe"], "next").and.callThrough();

    mockClass.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it("should call complete() when ngOnDestroy is called", () => {
    class MockClass extends withUnsubscribe() {}
    const mockClass = new MockClass();
    const spy = spyOn(mockClass["unsubscribe"], "complete").and.callThrough();

    mockClass.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
