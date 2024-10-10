import { IVerification } from "@models/Verification";
import { modelData } from "@test/helpers/faker";
import { generateAudioEvent } from "./AudioEvent";

// TODO: change this to a proper verification generator once the API is functional
export function generateVerification(
  data?: Partial<IVerification>
): Required<IVerification> {
  return {
    ...generateAudioEvent(data),
    audioLink: data?.audioLink ?? modelData.internet.url(),
  };
}
