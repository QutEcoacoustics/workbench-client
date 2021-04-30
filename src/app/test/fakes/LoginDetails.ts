import { ILoginDetails } from "@models/data/LoginDetails";
import { modelData } from "@test/helpers/faker";

export function generateLoginDetails(): Required<ILoginDetails> {
  return {
    login: modelData.internet.userName(),
    password: modelData.internet.password(),
  };
}
