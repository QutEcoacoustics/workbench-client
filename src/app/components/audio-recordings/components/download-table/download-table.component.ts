import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters, Sorting } from "@baw-api/baw-api.service";
import {
  SortEvent,
  TablePage,
} from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { DateTime } from "luxon";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
  tap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

type RecordingFilters = Filters<AudioRecording>;
interface TableRow {
  id: Id;
  site: AudioRecording;
  recorded: AudioRecording;
  duration: string;
  mediaType: string;
  originalFileName: string;
}

@Component({
  selector: "baw-download-table",
  templateUrl: "./download-table.component.html",
})
export class DownloadTableComponent implements OnInit {
  @Input() public filters$: Observable<RecordingFilters>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  public columns = [
    { name: "Id" },
    { name: "Site" },
    { name: "Recorded" },
    { name: "Duration" },
    { name: "Media Type" },
    { name: "Original File Name" },
  ];
  public sortKeys = {
    id: "id",
    site: "siteId",
    recorded: "recordedDate",
    duration: "durationSeconds",
    mediaType: "mediaType",
    originalFileName: "originalFileName",
  };

  /** Triggers whenever row data changes */
  public rows$: Observable<TableRow[]>;
  /** Triggers whenever loading table data */
  public loading$ = new BehaviorSubject(false);
  /** Triggers whenever page changes */
  public page$ = new BehaviorSubject(0);
  /** Triggers whenever sort event occurs */
  public sort$ = new BehaviorSubject<Sorting<keyof AudioRecording>>({
    direction: "asc",
    orderBy: "id",
  });
  /** Tracks total number of recordings */
  public total$: Observable<number>;

  public constructor(private recordingsApi: AudioRecordingsService) {}

  public ngOnInit(): void {
    const filterAndResetPage$ = this.filters$.pipe(
      // Reset page number whenever filter changes
      tap(() => this.page$.next(0))
    );

    const getRecordings = (filters: RecordingFilters) =>
      this.recordingsApi.filter(filters);

    const recordings$ = combineLatest([
      this.page$,
      this.sort$,
      filterAndResetPage$,
    ]).pipe(
      debounceTime(defaultDebounceTime),
      tap(() => this.loading$.next(true)),
      map(
        ([page, sort, filter]): RecordingFilters => ({
          ...filter,
          sorting: sort,
          paging: { page: page + 1 },
        })
      ),
      switchMap(getRecordings),
      tap(() => this.loading$.next(false))
    );

    this.rows$ = recordings$.pipe(
      map((recordings): TableRow[] =>
        recordings.map(
          (recording): TableRow => ({
            id: recording.id,
            site: recording,
            recorded: recording,
            duration: toRelative(recording.duration, {
              largest: 2,
              round: true,
            }),
            mediaType: recording.mediaType,
            originalFileName: recording.originalFileName,
          })
        )
      )
    );

    this.total$ = recordings$.pipe(
      map((recordings) => recordings[0]?.getMetadata().paging.total ?? 0)
    );
  }

  public setPage(pageInfo: TablePage): void {
    this.page$.next(pageInfo.offset);
  }

  public onSort(event: SortEvent): void {
    if (!event.newValue) {
      this.sort$.next({ direction: "asc", orderBy: "id" });
      this.page$.next(0);
    } else {
      this.sort$.next({
        direction: event.newValue,
        orderBy: this.sortKeys[event.column.prop],
      });
      this.page$.next(0);
    }
  }

  public formatDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd hh:mm:ss");
  }
}
