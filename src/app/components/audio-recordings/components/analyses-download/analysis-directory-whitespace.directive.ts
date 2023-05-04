import { Directive, HostBinding, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[bawIndentation]",
})
export class AnalysisDirectoryIndentationDirective implements OnInit
{
  @Input("bawIndentation") public indentation: number;
  @HostBinding("style.width") public width: string;

  public ngOnInit(): void {
    this.width = `${this.indentation}rem`;
  }
}
