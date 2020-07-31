import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { User } from "@models/User";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { validateApiShow } from "src/app/test/helpers/api-common";
import { UserService } from "./user.service";

describe("UserService", function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      providers: [UserService],
    });

    this.service = TestBed.inject(UserService);
  });

  validateApiShow<User, UserService>(
    "/my_account/",
    undefined,
    new User({ id: 5 })
  );
});
