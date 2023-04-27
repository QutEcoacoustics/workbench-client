import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[bawIndentation]"
})
export class AnalysisDirectoryIndentationDirective implements AfterViewInit
{
  public constructor(private element: ElementRef) { }

  public ngAfterViewInit(): void {
    this.element.nativeElement.style.marginLeft = `${this.indentation}em`;
  }

  @Input("bawIndentation") public indentation: any;
}
