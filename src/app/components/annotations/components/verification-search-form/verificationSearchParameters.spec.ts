import { VerificationParameters } from "../verification-form/verificationParameters";

describe("VerificationSearchParameters", () => {
  it("should create", () => {
    const dataModel = new VerificationParameters();
    expect(dataModel).toBeInstanceOf(VerificationParameters);
  });
});
