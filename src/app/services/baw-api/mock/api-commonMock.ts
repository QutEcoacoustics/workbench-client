import { Injectable } from "@angular/core";
import { BawApiService } from "../base-api.service";

@Injectable()
export class MockApiCommon<T> extends BawApiService {}
