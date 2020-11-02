import { IsUnresolvedPipe } from "./is-unresolved.pipe";

describe("IsUnresolvedPipe", () => {
  it("create an instance", () => {
    const pipe = new IsUnresolvedPipe();
    expect(pipe).toBeTruthy();
  });
});
