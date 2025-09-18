import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "baw-meta-review-whitespace",
  template: `
    @for (indent of indentation(); track indent) {
      <span class="vertical-line"></span>
      <div class="whitespace-block"></div>
    }

    @if (isFolder()) {
      <span class="vertical-half-line"></span>
    }
  `,
  styles: [`
    .vertical-half-line {
      position: relative;
    }

    .vertical-half-line::before {
      border-left: 1px solid grey;
      display: inline-block;
      position: absolute;
      height: 30%;
      bottom: calc(-1 * var(--table-padding));
      width: 1px;
      margin: 0;
      content: "";
    }

    .vertical-line {
      position: relative;
    }

    .vertical-line::before {
      border-left: 1px solid grey;
      display: inline-block;
      position: absolute;
      top: calc(-1 * var(--table-padding));
      bottom: calc(-1 * var(--table-padding));
      width: 1px;
      margin: 0;
      content: "";
    }

    .whitespace-block {
      display: inline-block;
      width: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhitespaceComponent {
  public readonly indentation = input<void[]>(undefined);
  public readonly isFolder = input<boolean>(undefined);
}
