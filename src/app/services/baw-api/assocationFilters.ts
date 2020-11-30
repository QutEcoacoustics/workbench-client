import { IAudioRecording } from "@models/AudioRecording";
import { ITagging } from "@models/Tagging";

export type AudioRecordings = `audioRecordings.${keyof IAudioRecording}`;
export type Taggings = `taggings.${keyof ITagging}`;
