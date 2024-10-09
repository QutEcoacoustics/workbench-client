import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ContextRequestEvent } from "@helpers/context/context";
import { IVerification } from "@models/Verification";
import { gridTileContext } from "@ecoacoustics/web-components";
import { interval } from "rxjs";

@Component({
  standalone: true,
  selector: "baw-grid-tile-content",
  template: `
    <div #wrapper style="display: flex; justify-content: space-evenly;">
      <a [href]="listenLink">Listen</a>
      <a [href]="contextLink">Context</a>
    </div>
  `,
})
export class GridTileContentComponent implements AfterViewInit {
  @ViewChild("wrapper") private wrapper: ElementRef<HTMLDivElement>;

  protected listenLink: string = "test";
  protected contextLink: string = "abc";

  public ngAfterViewInit(): void {
    // interval(1000)
    //   // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    //   .subscribe(() => {
    //     this.requestContext();
    //   });
    console.count("ngAfterViewInit");
    this.requestContext();
  }

  public handleContextChange(subjectModel: IVerification): void {
    console.debug(subjectModel);
    this.listenLink = subjectModel.audioLink;
    this.contextLink = subjectModel.audioLink;
  }

  private requestContext(): void {
    this.wrapper.nativeElement.dispatchEvent(
      new ContextRequestEvent(
        gridTileContext,
        this.handleContextChange.bind(this),
        true
      )
    );
  }
}
