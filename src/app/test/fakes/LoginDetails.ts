import { ILoginDetails } from "@models/data/LoginDetails";
import { modelData } from "@test/helpers/faker";

export function generateLoginDetails(
  data?: Partial<ILoginDetails>
): Required<ILoginDetails> {
  return {
    login: modelData.internet.userName(),
    password: modelData.internet.password(),
    ...data,
  };
}
