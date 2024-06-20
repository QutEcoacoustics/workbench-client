import { AudioEvent } from "./AudioEvent";

export interface IVerification {}

// TODO: this shouldn't extend AudioEvent, but I have done this for testing
// while there is not verification endpoint on the api
export class Verification extends AudioEvent implements IVerification {}
