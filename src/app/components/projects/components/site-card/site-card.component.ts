import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { NgTemplateOutlet, AsyncPipe } from "@angular/common";
import { UrlDirective } from "@directives/url/url.directive";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { WithLoadingPipe } from "../../../../pipes/with-loading/with-loading.pipe";

@Component({
  selector: "baw-site-card",
  template: `
    <li class="list-group-item p-2">
      <div class="body">
        <div class="heading m-0 mb-1">
          <a id="nameLink" [bawUrl]="model().getViewUrl(project())">
            <img
              id="image"
              class="me-2"
              [src]="model().imageUrls"
              [alt]="model().name + ' alt'"
            />
            <h5 id="name">{{ model().name }}</h5>
          </a>
        </div>

        <ul class="nav mb-0">
          @if (region()) {
            <li class="nav-item" id="points">
              <span class="badge rounded-pill text-bg-highlight my-1">
                {{ numPoints() }} {{ numPoints() === 1 ? "Point" : "Points" }}
              </span>
            </li>
          }

          <ng-container [ngTemplateOutlet]="noAudioTemplate"></ng-container>
        </ul>
      </div>
    </li>

    <ng-template #noAudioTemplate>
      @if (hasNoAudio$ | withLoading | async; as hasNoAudio) {
        <li>
          @if (hasNoAudio.value !== false) {
            <span
              id="no-audio"
              class="badge rounded-pill text-bg-secondary my-1"
            >
              @if (hasNoAudio.loading) {
                <baw-loading size="sm" color="light"></baw-loading>
              }
              @if (hasNoAudio.value) {
                <span>No audio yet</span>
              }
            </span>
          }
        </li>
      }
    </ng-template>
  `,
  styleUrl: "./site-card.component.scss",
  imports: [
    UrlDirective,
    AuthenticatedImageDirective,
    NgTemplateOutlet,
    LoadingComponent,
    AsyncPipe,
    WithLoadingPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteCardComponent implements OnInit {
  public project = input<Project>();
  public region = input<Region>();
  public site = input<Site>();
  protected model = computed(() => this.region() || this.site());

  protected hasNoAudio$: Observable<boolean>;

  private associationInjector = inject(ASSOCIATION_INJECTOR);
  private recordingApi = this.associationInjector.get(AudioRecordingsService);

  public ngOnInit(): void {
    this.hasNoAudio$ = this.getRecording().pipe(
      first(),
      map((recordings): boolean => recordings.length === 0)
    );
  }

  public numPoints(): number {
    return this.region()?.siteIds?.size || 0;
  }

  private getRecording(): Observable<AudioRecording[]> {
    const filter = { paging: { items: 1 } } as const;
    if (this.region()) {
      return this.recordingApi.filterByRegion(filter, this.region());
    } else {
      return this.recordingApi.filterBySite(filter, this.site());
    }
  }
}
