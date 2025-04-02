import { Injectable } from "@angular/core";

// If you do not do a type import here, the bundle size will increase by 5MB
// I have also decided to import the typings for spdx-license-list instead of
// creating a side-car interface so that if the license shape changes in a
// dependency bump, TypeScript will raise an error.
import type spdxLicenses from "spdx-license-list/full";

export type SpdxLicense = (typeof spdxLicenses)[0];

@Injectable({ providedIn: "root" })
export class LicensesService {
  public async availableLicenses(): Promise<Record<string, SpdxLicense>> {
    // Because the spdx license list is quite large (5MB), importing the
    // license list into the client bundle would almost double the clients
    // bundle size for something that is only needed on one page.
    // To minimize the bundle size, I dynamically import the spdx license
    // list so that the 5MB is only loaded when the user needs.
    const licenses = await import("node_modules/spdx-license-list/full");
    return licenses.default;
  }

  public async suggestedLicenses(): Promise<SpdxLicense[]> {
    const licenses = this.availableLicenses();
    const topLicenses: (keyof typeof spdxLicenses)[] = ["mit-license"];

    return topLicenses.map((license) => licenses[license]);
  }
}
