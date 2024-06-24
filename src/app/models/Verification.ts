import { AudioEvent, IAudioEvent } from "./AudioEvent";

// TODO: uncomment the correct IVerification interface once the API is available
// export interface IVerification {}
export type IVerification = IAudioEvent;

// TODO: this shouldn't extend AudioEvent, but I have done this for testing
// while there is not verification endpoint on the api
export class Verification extends AudioEvent implements IVerification {}
