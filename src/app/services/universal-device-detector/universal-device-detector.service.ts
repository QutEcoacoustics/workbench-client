import { Injectable, PLATFORM_ID, REQUEST, inject } from "@angular/core";
import { Request } from "express";
import { DeviceDetectorService } from "ngx-device-detector";
import { isPlatformServer } from "@angular/common";

@Injectable()
export class UniversalDeviceDetectorService extends DeviceDetectorService {
  public constructor() {
    const platformId = inject(PLATFORM_ID);
    const request = inject<Request>(REQUEST, { optional: true })!;

    super(platformId);
    if (isPlatformServer(platformId)) {
      super.setDeviceInfo((request.headers["user-agent"] as string) || "");
    }
  }
}
