import { Duration } from "luxon";

//! TODO: Remove once https://github.com/moment/luxon/issues/415 is fixed
// these monkey patches are necessary because Luxon formats negative durations like "PT-10M-1.5S" instead of "-PT10M1.5S"
// and parses negative durations like "PT-10M-1.5S" instead of "-PT10M1.5S"
// this is unintuitive and breaks away from the ECMA Temporal spec
export function patchLuxonDuration(): void {
  patchToFormat();
  patchToISO();
  patchFromISO();
}

function patchToFormat(): void {
  Duration.prototype["_toFormat"] = Duration.prototype.toFormat;

  Duration.prototype.toFormat = function(fmt: string, opts?: { floor?: boolean }): string {
    if (this.valueOf() < 0) {
      const negativeDuration = this.negate();
      return `-${negativeDuration["_toFormat"](fmt, opts)}`;
    }

    return Duration.prototype["_toFormat"].call(this, fmt, opts);
  }
}

function patchToISO(): void {
  Duration.prototype["_toISO"] = Duration.prototype.toISO;

  Duration.prototype.toISO = function(): string {
    // without rescaling, positive durations with negative parts will be formatted similar to "PT10M-1.5S"
    // where the minutes are positive, but the seconds are negative
    // because the duration is positive, we do not want to negate it with our monkey patch, however, emitting partial negatives
    // goes against the objectives of this monkey patch
    // therefore, we rescale it, so that the duration is positive, but the negative parts are subtracted from the positive parts
    // eg. "PT10M-1.5S" becomes "PT9M58.5S"
    const scaledDuration = this.rescale();

    if (scaledDuration.valueOf() < 0) {
      const negativeDuration = scaledDuration.negate();
      return `-${negativeDuration["_toISO"]()}`;
    }

    return Duration.prototype["_toISO"].call(scaledDuration);
  }
}

function patchFromISO(): void {
  Duration["_fromISO"] = Duration.fromISO;

  Duration.fromISO = function(text: string, opts?: { conversionAccuracy?: string }): Duration {
    if (text.startsWith("-")) {
      const negativeDuration = Duration["_fromISO"](text.slice(1), opts);
      return negativeDuration.negate();
    }

    return Duration["_fromISO"](text, opts);
  }
}
