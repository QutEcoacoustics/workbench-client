import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Description, Param } from "@interfaces/apiInterfaces";
import { AbstractForm } from "@models/AbstractForm";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const dataRequestEndpoint = stringTemplate`/data_request`;

@Injectable()
export class DataRequestService extends BawFormApiService<DataRequest> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, DataRequest, injector);
  }

  public dataRequest(details: DataRequest): Observable<void> {
    return this.makeFormRequest(
      dataRequestEndpoint(),
      dataRequestEndpoint(),
      (token) => details.getBody(token)
    ).pipe(
      // Void output
      map(() => undefined)
    );
  }

  public seed() {
    return this.getRecaptchaSeed(dataRequestEndpoint());
  }
}

export const dataRequestGroupType = [
  { key: "general", value: "General" },
  { key: "academic", value: "Academic" },
  { key: "government", value: "Government" },
  { key: "non_profit", value: "Non Profit" },
  { key: "commercial", value: "Commercial" },
  { key: "personal", value: "Personal" },
] as const;

export type DataRequestGroupType = typeof dataRequestGroupType[number]["key"];

export interface IDataRequest {
  name: Param;
  email: Param;
  group: string;
  groupType: DataRequestGroupType;
  content: Description;
  recaptchaToken: string;
}

export class DataRequest
  extends AbstractForm<IDataRequest>
  implements IDataRequest {
  public readonly kind = "DataRequest";
  @bawPersistAttr
  public readonly name: string;
  @bawPersistAttr
  public readonly email: string;
  @bawPersistAttr
  public readonly group: string;
  @bawPersistAttr
  public readonly groupType: DataRequestGroupType;
  @bawPersistAttr
  public readonly content: string;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public getBody(token: string): URLSearchParams {
    const body = new URLSearchParams();
    body.set("data_class_data_request[name]", this.name);
    body.set("data_class_data_request[email]", this.email);
    body.set("data_class_data_request[group]", this.group);
    body.set("data_class_data_request[groupType]", this.groupType);
    body.set("data_class_data_request[content]", this.content);
    body.set("g-recaptcha-response-data[data_request]", this.recaptchaToken);
    body.set("g-recaptcha-response", "");
    body.set("commit", "Submit");
    body.set("authenticity_token", token);
    return body;
  }
}
