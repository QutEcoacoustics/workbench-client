import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "baw-pill-list",
  templateUrl: "./pill-list.component.html",
})
export class PillListComponent implements OnInit {
  @Input() public text: string[];
  @Input() public numPills: number;
  public pills: string[];
  public ellipsis: boolean;
  public compress: boolean;

  constructor() {}

  public ngOnInit() {
    this.compress = this.numPills < this.text.length;
    this.pills = this.getPills(this.numPills);
  }

  public getPills(displayPills: number) {
    this.ellipsis = displayPills < this.text.length;
    return this.ellipsis ? this.text.slice(0, displayPills) : this.text;
  }

  public toggleExpansion() {
    this.pills = this.ellipsis
      ? this.getPills(this.text.length)
      : this.getPills(this.numPills);
  }
}
