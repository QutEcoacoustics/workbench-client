import { ErrorableNumberPipe } from "./errorable-number.pipe";

describe("ErrorableNumberPipe", () => {
  it("create an instance", () => {
    const pipe = new ErrorableNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
