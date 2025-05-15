import { Inject, Injectable, Optional, PLATFORM_ID } from "@angular/core";
import { Request } from "express";
import { DeviceDetectorService } from "ngx-device-detector";
import { isPlatformServer } from "@angular/common";
import { REQUEST } from "../../../express.tokens";

@Injectable()
export class UniversalDeviceDetectorService extends DeviceDetectorService {
  public constructor(
    @Inject(PLATFORM_ID) platformId: any,
    @Optional() @Inject(REQUEST) request: Request
  ) {
    console.log("request", request);
    super(platformId);
    if (isPlatformServer(platformId)) {
      super.setDeviceInfo((request.headers["user-agent"] as string) || "");
    }
  }
}
