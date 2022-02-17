import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
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
import { BawApiStateService } from "@baw-api/baw-api-state.service";
import { BawApiService } from "@baw-api/baw-api.service";
import { ServiceToken } from "@baw-api/ServiceTokens";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { MockModel } from "./baseApiMock.service";

export const MOCK = new ServiceToken<MockStandardApiService>(
  "STANDARD_API_SERVICE"
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multipleModels = (...args: any[]) => new Observable<MockModel[]>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const singleModel = (...args: any[]) => new Observable<MockModel>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteMock = (...args: any[]) => new Observable<MockModel | void>();

@Injectable()
export class MockStandardApiService extends StandardApi<MockModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
  public update = singleModel;
  public destroy = deleteMock;
}

@Injectable()
export class MockImmutableApiService extends ImmutableApi<MockModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
  public destroy = deleteMock;
}

@Injectable()
export class MockNonDestructibleApiService extends NonDestructibleApi<MockModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
  public update = singleModel;
}

@Injectable()
export class MockReadAndCreateApiService extends ReadAndCreateApi<MockModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public create = singleModel;
}

@Injectable()
export class MockReadAndUpdateApiService extends ReadAndUpdateApi<MockModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
  public update = singleModel;
}

@Injectable()
export class MockReadonlyApiService extends ReadonlyApi<MockModel> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public list = multipleModels;
  public filter = multipleModels;
  public show = singleModel;
}

@Injectable()
export class MockShowApiService
  extends BawApiService<MockModel>
  implements ApiShow<MockModel, [], IdOr<MockModel>>
{
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public show = singleModel;
}

@Injectable()
export class MockFilterApiService
  extends BawApiService<MockModel>
  implements ApiFilter<MockModel>
{
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, MockModel, injector, state);
  }

  public filter = multipleModels;
}
