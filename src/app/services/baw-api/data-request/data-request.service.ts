import { Injectable } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { DataRequest } from "@models/data/DataRequest";
import { Observable } from "rxjs";
import { catchError, first, map } from "rxjs/operators";

const dataRequestEndpoint = stringTemplate`/data_request`;

@Injectable()
export class DataRequestService {
  public constructor(private api: BawFormApiService<DataRequest>) {}

  public dataRequest(details: DataRequest): Observable<void> {
    const validateEmail = (page: string): void => {
      const errMsg =
        'id="data_class_data_request_email" /><span class="help-block">is invalid';
      if (page.includes(errMsg)) {
        throw Error("Email address is invalid");
      }
    };

    const validateOrganization = (page: string): void => {
      const errMsg =
        'id="data_class_data_request_group" /><span class="help-block">can&#39;t be blank';
      if (page.includes(errMsg)) {
        throw Error("Organization name is invalid");
      }
    };

    const validateOrganizationType = (page: string): void => {
      const errMsg =
        '</select><span class="help-block">is not included in the list';
      if (page.includes(errMsg)) {
        throw Error("Organization type is invalid");
      }
    };

    return this.api
      .makeFormRequest(dataRequestEndpoint(), dataRequestEndpoint(), (token) =>
        details.getBody(token)
      )
      .pipe(
        map((page) => {
          validateEmail(page);
          validateOrganization(page);
          validateOrganizationType(page);
        }),
        // Complete observable
        first(),
        catchError(this.api.handleError)
      );
  }

  public seed() {
    return this.api.getRecaptchaSeed(dataRequestEndpoint());
  }
}
