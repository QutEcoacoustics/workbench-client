import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BawApiService } from "../base-api.service";

@Injectable()
export class MockModelService<T> extends BawApiService {
  protected details(): Subject<T[]> {
    return new Subject<T[]>();
  }

  protected show(): Subject<T> {
    return new Subject<T>();
  }

  protected new(): Subject<T> {
    return new Subject<T>();
  }

  protected update(): Subject<T> {
    return new Subject<T>();
  }
}
