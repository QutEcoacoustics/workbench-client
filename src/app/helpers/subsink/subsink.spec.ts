import { Subject } from "rxjs";
import { SubSink } from "./subsink";

describe("SubSink", () => {
  it("should add single subscription", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");
    const next1 = spyOn(sub1, "next");

    subSink.add(subscription1);
    sub1.next(1);

    expect(next1).toHaveBeenCalled();
    expect(unsubscribe1).not.toHaveBeenCalled();
  });

  it("should add multiple subscriptions", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");
    const next1 = spyOn(sub1, "next");

    const sub2 = new Subject<number>();
    const subscription2 = sub2.subscribe(noop, noop, noop);
    const unsubscribe2 = spyOn(subscription2, "unsubscribe");
    const next2 = spyOn(sub2, "next");

    subSink.add(subscription1);
    subSink.add(subscription2);
    sub1.next(1);
    sub2.next(1);

    expect(next1).toHaveBeenCalled();
    expect(next2).toHaveBeenCalled();
    expect(unsubscribe1).not.toHaveBeenCalled();
    expect(unsubscribe2).not.toHaveBeenCalled();
  });

  it("should sink single subscription", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");
    const next1 = spyOn(sub1, "next");

    subSink.sink = subscription1;
    sub1.next(1);

    expect(next1).toHaveBeenCalled();
    expect(unsubscribe1).not.toHaveBeenCalled();
  });

  it("should sink multiple subscriptions", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");
    const next1 = spyOn(sub1, "next");

    const sub2 = new Subject<number>();
    const subscription2 = sub2.subscribe(noop, noop, noop);
    const unsubscribe2 = spyOn(subscription2, "unsubscribe");
    const next2 = spyOn(sub2, "next");

    subSink.sink = subscription1;
    subSink.sink = subscription2;
    sub1.next(1);
    sub2.next(1);

    expect(next1).toHaveBeenCalled();
    expect(next2).toHaveBeenCalled();
    expect(unsubscribe1).not.toHaveBeenCalled();
    expect(unsubscribe2).not.toHaveBeenCalled();
  });

  it("should unsubscribe single added subscription", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");

    subSink.add(subscription1);
    subSink.unsubscribe();

    expect(unsubscribe1).toHaveBeenCalled();
  });

  it("should unsubscribe multiple added subscriptions", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");

    const sub2 = new Subject<number>();
    const subscription2 = sub2.subscribe(noop, noop, noop);
    const unsubscribe2 = spyOn(subscription2, "unsubscribe");

    subSink.add(subscription1);
    subSink.add(subscription2);
    subSink.unsubscribe();

    expect(unsubscribe1).toHaveBeenCalled();
    expect(unsubscribe2).toHaveBeenCalled();
  });

  it("should unsubscribe single sink subscription", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");

    subSink.sink = subscription1;
    subSink.unsubscribe();

    expect(unsubscribe1).toHaveBeenCalled();
  });

  it("should unsubscribe multiple sink subscriptions", () => {
    const subSink = new SubSink();
    const noop = () => {};

    const sub1 = new Subject<number>();
    const subscription1 = sub1.subscribe(noop, noop, noop);
    const unsubscribe1 = spyOn(subscription1, "unsubscribe");

    const sub2 = new Subject<number>();
    const subscription2 = sub2.subscribe(noop, noop, noop);
    const unsubscribe2 = spyOn(subscription2, "unsubscribe");

    subSink.sink = subscription1;
    subSink.sink = subscription2;
    subSink.unsubscribe();

    expect(unsubscribe1).toHaveBeenCalled();
    expect(unsubscribe2).toHaveBeenCalled();
  });
});
