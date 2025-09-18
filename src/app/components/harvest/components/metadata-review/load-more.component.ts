import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from "@angular/core";
import { MetaReviewLoadMore } from "@components/harvest/screens/metadata-review/metadata-review.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { WhitespaceComponent } from "./whitespace.component";

@Component({
  selector: "baw-meta-review-load-more-row",
  template: `
    <div class="grid-table-item load-more">
      <!-- Whitespace -->
      <baw-meta-review-whitespace
        [indentation]="row().parentFolder.indentation"
      ></baw-meta-review-whitespace>

      @if (row().isLoading) {
        <baw-loading class="m-auto"></baw-loading>
      }

      @if (!row().isLoading) {
        <button
          class="btn btn-sm btn-outline-primary m-auto load-more"
          (click)="loadMore.emit()"
        >
          {{ row().parentFolder.isRoot ? "Load More" : "Load more from " }}
          <span class="font-monospace">{{ row().parentFolder.path }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .load-more {
      grid-column: 1 / 6;
    }

    baw-meta-review-whitespace {
      display: contents;
    }
  `],
  // Nothing in this component can change without a change in the row
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WhitespaceComponent, LoadingComponent]
})
export class LoadMoreComponent {
  public readonly row = input<MetaReviewLoadMore>();
  public readonly loadMore = output<void>();
}
