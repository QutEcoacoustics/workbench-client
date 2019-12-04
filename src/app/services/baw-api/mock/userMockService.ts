import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User, UserInterface } from "src/app/models/User";
import { BawApiService } from "../base-api.service";
import { SecurityService } from "../security.service";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends BawApiService {
  constructor(private securityApi: SecurityService, http: HttpClient) {
    super(http);
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  getMyAccount(): Subject<User> {
    const subject = new Subject<User>();

    if (this.securityApi.isLoggedIn()) {
      subject.next(
        new User({
          id: 1,
          userName: "Username",
          rolesMask: 1,
          timezoneInformation: null,
          rolesMaskNames: [],
          imageUrls: [
            {
              size: "extralarge",
              url: "/images/user/user_span4.png",
              width: 300,
              height: 300
            },
            {
              size: "large",
              url: "/images/user/user_span3.png",
              width: 220,
              height: 220
            },
            {
              size: "medium",
              url: "/images/user/user_span2.png",
              width: 140,
              height: 140
            },
            {
              size: "small",
              url: "/images/user/user_span1.png",
              width: 60,
              height: 60
            },
            {
              size: "tiny",
              url: "/images/user/user_spanhalf.png",
              width: 30,
              height: 30
            }
          ],
          lastSeenAt: new Date("2019-12-04T08:58:03.864+10:00"),
          preferences: null,
          isConfirmed: true
        })
      );
    } else {
      subject.next(null);
    }

    return subject;
  }

  /**
   * Get the user account details of another user
   * @param id User ID
   * @returns Observable returning user details
   */
  getUserAccount(id: ID): Subject<User> {
    const subject = new Subject<User>();

    subject.next(
      new User({
        id,
        userName: "Username",
        rolesMask: 1,
        timezoneInformation: null,
        rolesMaskNames: [],
        imageUrls: [
          {
            size: "extralarge",
            url: "/images/user/user_span4.png",
            width: 300,
            height: 300
          },
          {
            size: "large",
            url: "/images/user/user_span3.png",
            width: 220,
            height: 220
          },
          {
            size: "medium",
            url: "/images/user/user_span2.png",
            width: 140,
            height: 140
          },
          {
            size: "small",
            url: "/images/user/user_span1.png",
            width: 60,
            height: 60
          },
          {
            size: "tiny",
            url: "/images/user/user_spanhalf.png",
            width: 30,
            height: 30
          }
        ],
        lastSeenAt: new Date("2019-12-04T08:58:03.864+10:00"),
        preferences: null,
        isConfirmed: true
      })
    );

    return subject;
  }
}
