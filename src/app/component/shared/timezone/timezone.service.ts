import { Injectable } from "@angular/core";
import { countryList, zones } from "./timezoneData";

export interface Timezone {
  iso: string;
  zones: string[];
}

/**
 * Timezone Service.
 * A service used to convert timezone data into usable data for the timezone input.
 */
@Injectable({
  providedIn: "root"
})
export class TimezoneService {
  /**
   * Convert country ISO code to country name (in english)
   */
  iso2country(iso: string): string {
    return countryList[iso] ? countryList[iso] : iso;
  }

  /**
   * Gets the list of ISO-codes for all countries
   */
  getCountries(): string[] {
    const res: string[] = [];
    for (const prop of Object.keys(countryList)) {
      res.push(prop);
    }
    return res;
  }

  /**
   * Get the timezones for each country
   */
  getZones(): Timezone[] {
    const res = [];
    for (const prop of Object.keys(zones)) {
      res.push({
        iso: prop,
        zones: zones[prop]
      });
    }
    return res;
  }
}
