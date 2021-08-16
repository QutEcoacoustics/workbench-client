import { IRegisterDetails } from "@models/data/RegisterDetails";
import { modelData } from "@test/helpers/faker";

export function generateRegisterDetails(
  data?: Partial<IRegisterDetails>
): Required<IRegisterDetails> {
  const password = modelData.internet.password();
  return {
    email: modelData.internet.email(),
    userName: modelData.internet.userName(),
    password,
    passwordConfirmation: password,
    recaptchaToken: modelData.random.alphaNumeric(484),
    ...data,
  };
}
