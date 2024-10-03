import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ContextRequestEvent } from "@helpers/context/context";
import { IVerification } from "@models/Verification";
import { gridTileContext } from "@ecoacoustics/web-components";

@Component({
  standalone: true,
  selector: "baw-grid-tile-content",
  template: `
    <div #wrapper>
      <div>{{ listenLink }}</div>
      <div>{{ contextLink }}</div>
    </div>
  `,
})
export class GridTileContentComponent implements AfterViewInit {
  @ViewChild("wrapper") private wrapper: ElementRef<HTMLDivElement>;

  protected listenLink: string = "test";
  protected contextLink: string = "abc";

  public ngAfterViewInit(): void {
    this.wrapper.nativeElement.dispatchEvent(
      new ContextRequestEvent(
        gridTileContext,
        this.handleContextChange.bind(this),
        true,
      )
    );
  }

  private handleContextChange = (subjectModel: IVerification) => {
    console.debug(subjectModel);
    this.listenLink = subjectModel.audioLink;
    this.contextLink = subjectModel.audioLink;
  }
}
