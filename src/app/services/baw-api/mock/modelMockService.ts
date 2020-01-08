import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BawApiService } from "../base-api.service";

@Injectable()
export class MockModelService<T> extends BawApiService {}
