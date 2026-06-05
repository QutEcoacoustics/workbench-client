import { inject, Injectable } from "@angular/core";
import { ApiFilterGroupBy } from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { Observable } from "rxjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const endpoint = stringTemplate`/audio_events/group_by/sites`;

@Injectable({ providedIn: "root" })
export class GroupedAudioEventsService
  implements ApiFilterGroupBy<AudioEvent, AudioEventGroup>
{
  private readonly api = inject(BawApiService<AudioEventGroup>);

  public filterGroupBy(filters: Filters<AudioEvent>): Observable<AudioEventGroup[]> {
    return this.api.filter<AudioEvent>(AudioEventGroup, endpoint(), filters);
  }
}
