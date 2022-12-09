import { Component, Input } from "@angular/core";

@Component({
  selector: "baw-directory-whitespace",
  template: `
    <span class="vertical-line"></span>
    <div class="whitespace-block"></div>
    <span *ngIf="isFolder && open" class="vertical-half-line"></span>
  `,
  styles: [
    `
      .vertical-half-line {
        position: absolute;
        border-left: 1px solid grey;
        display: inline-block;
        height: 30%;
        bottom: 20px;
        left: 5px;
        width: 1px;
        margin: 0;
      }


      .vertical-line {
        display: block;
        border-left: 1px solid grey;
        width: 1px;
        height: 100%;
        margin-left: 5px;
      }

      .whitespace-block {
        display: inline-block;
        width: 1rem;
      }
    `,
  ],
})
export class AnalysisDownloadWhitespaceComponent {
  @Input() public isFolder: boolean;
  @Input() public open: boolean;
}
