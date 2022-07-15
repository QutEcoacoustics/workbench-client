import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MetaReviewLoadMore } from "@components/harvest/screens/metadata-review/metadata-review.component";

@Component({
  selector: "baw-meta-review-load-more-row",
  template: `
    <div class="grid-table-item load-more">
      <!-- Whitespace -->
      <baw-meta-review-whitespace
        [indentation]="row.parentFolder.indentation"
      ></baw-meta-review-whitespace>

      <baw-loading *ngIf="row.isLoading" class="m-auto"></baw-loading>

      <button
        *ngIf="!row.isLoading"
        class="btn btn-sm btn-outline-primary m-auto load-more"
        (click)="loadMore.emit()"
      >
        {{ row.parentFolder.isRoot ? "Load More" : "Load more from " }}
        <span class="font-monospace">{{ row.parentFolder.path }}</span>
      </button>
    </div>
  `,
  styles: [
    `
      .load-more {
        grid-column: 1 / 6;
      }

      baw-meta-review-whitespace {
        display: contents;
      }
    `,
  ],
  // Nothing in this component can change without a change in the row
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadMoreComponent {
  @Input() public row: MetaReviewLoadMore;
  @Output() public loadMore = new EventEmitter<void>();
}
