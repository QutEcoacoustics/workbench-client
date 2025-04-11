import { Injectable } from "@angular/core";
import {
  ApiFilter,
  ApiShow,
  IdOr,
  ImmutableApi,
  NonDestructibleApi,
  ReadAndCreateApi,
  ReadAndUpdateApi,
  ReadonlyApi,
  StandardApi,
} from "@baw-api/api-common";
import { ServiceToken } from "@baw-api/ServiceTokens";
import { Observable } from "rxjs";
import { MockModel } from "./baseApiMock.service";

export const MOCK = new ServiceToken<MockStandardApiService>("STANDARD_API_SERVICE");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multipleModels = (...args: any[]) => new Observable<MockModel[]>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const singleModel = (...args: any[]) => new Observable<MockModel>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteMock = (...args: any[]) => new Observable<MockModel | void>();

@Injectable()
export class MockStandardApiService implements StandardApi<MockModel> {
  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
  public update = singleModel;
  public destroy = deleteMock;
}

@Injectable()
export class MockImmutableApiService implements ImmutableApi<MockModel> {
  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
  public destroy = deleteMock;
}

@Injectable()
export class MockNonDestructibleApiService implements NonDestructibleApi<MockModel> {
  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
  public update = singleModel;
}

@Injectable()
export class MockReadAndCreateApiService implements ReadAndCreateApi<MockModel> {
  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
}

@Injectable()
export class MockReadAndUpdateApiService implements ReadAndUpdateApi<MockModel> {
  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public update = singleModel;
}

@Injectable()
export class MockReadonlyApiService implements ReadonlyApi<MockModel> {
  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
}

@Injectable()
export class MockShowApiService implements ApiShow<MockModel, [], IdOr<MockModel>> {
  public show = singleModel;
}

@Injectable()
export class MockFilterApiService implements ApiFilter<MockModel> {
  public filter = multipleModels;
}
