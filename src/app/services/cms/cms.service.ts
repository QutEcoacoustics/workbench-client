import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CmsService {
  constructor() {}

  getPage(url: string) {
    const subject = new Subject<string>();

    setTimeout(() => {
      subject.next("Not Found (" + url + "): TODO: make me better");
      subject.complete();
    }, 2000);

    return subject;
  }
}
