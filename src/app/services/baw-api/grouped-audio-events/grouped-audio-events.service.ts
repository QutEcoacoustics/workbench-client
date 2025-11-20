import { inject, Injectable } from "@angular/core";
import { ApiFilterGroupBy } from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioEventGroup } from "@models/AudioEventGroup";
import { Observable, of } from "rxjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const endpoint = stringTemplate`/site/group/audio_events`;

// TODO: Finish this implementation once the server endpoint is complete
// see: https://github.com/QutEcoacoustics/baw-server/issues/852
@Injectable({ providedIn: "root" })
export class GroupedAudioEventsService
  implements ApiFilterGroupBy<AudioEvent, AudioEventGroup>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private readonly api = inject(BawApiService<AudioEventGroup>);

  public filterGroupBy(_filters: Filters<AudioEvent>): Observable<AudioEventGroup[]> {
    return of([
      new AudioEventGroup({
        siteId: 3605,
        eventCount: 67,
        latitude: -27.4975,
        longitude: 153.0136,
      }),
      new AudioEventGroup({
        siteId: 3606,
        eventCount: 42,
        latitude: -27.4773,
        longitude: 153.0271,
      }),
      new AudioEventGroup({
        siteId: 3873,
        eventCount: 9,
        latitude: 4.522871,
        longitude: 6.118915,
      }),
    ]);

    // return this.api.filter(AudioEventGroup, endpoint(), filters);
  }
}
