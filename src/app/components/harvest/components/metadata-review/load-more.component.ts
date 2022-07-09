import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MetaReviewLoadMore } from "@components/harvest/screens/metadata-review/metadata-review.component";

@Component({
  selector: "baw-meta-review-load-more-row",
  template: `
    <div class="grid-table-item load-more">
      <!-- Whitespace -->
      <baw-meta-review-whitespace
        style="display: contents"
        [indentation]="row.parentFolder.indentation"
      ></baw-meta-review-whitespace>

      <baw-loading *ngIf="row.isLoading" class="m-auto"></baw-loading>

      <button
        *ngIf="!row.isLoading"
        class="btn btn-sm btn-outline-primary m-auto"
        (click)="loadMore.emit()"
      >
        Load More from
        <span class="font-monospace">{{
          row.parentFolder.path || "root folder"
        }}</span>
      </button>
    </div>
  `,
  styles: [
    `
      .load-more {
        grid-column: 1 / 6;
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
