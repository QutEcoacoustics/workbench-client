type Seconds = number;
type Milliseconds = number;

export function secondsToMilliseconds(seconds: Seconds): Milliseconds {
  return seconds * 1_000;
}

export function millisecondsToSeconds(milliseconds: Milliseconds): Seconds {
  return milliseconds / 1_000;
}
