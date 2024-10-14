import { Injectable } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { API_ROOT } from "@services/config/config.tokens";

@Injectable()
export class MediaService {
  public constructor(
    private session: BawSessionService,
    @Inject(API_ROOT) private apiRoot: string
  ) {}

  public createMediaUrl(start: number, end: number) {
  }
}

