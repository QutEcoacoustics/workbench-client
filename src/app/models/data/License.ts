import { AbstractData } from "@models/AbstractData";
import { SpdxLicense } from "@services/licenses/licenses.service";

// TODO: this should be converted to an AbstractModel once the api supports
// a fixed license set
// see: https://github.com/QutEcoacoustics/baw-server/issues/750
export class License extends AbstractData implements SpdxLicense {
  public identifier: string;
  public name: string;
  public url: string;
  public osiApproved: boolean;
  public licenseText: string;

  public toString(): string {
    return this.name;
  }
}
