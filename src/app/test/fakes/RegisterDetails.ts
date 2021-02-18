import { IRegisterDetails } from "@baw-api/security/security.service";
import { modelData } from "@test/helpers/faker";

export function generateRegisterDetails(): Required<IRegisterDetails> {
  const password = modelData.internet.password();
  return {
    email: modelData.internet.email(),
    userName: modelData.internet.userName(),
    password,
    passwordConfirmation: password,
    recaptchaToken: modelData.random.alphaNumeric(484),
  };
}
