import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "baw-filter",
  template: `
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">{{ label }}</span>
      </div>
      <input
        type="text"
        class="form-control"
        [placeholder]="placeholder"
        (keyup)="onFilter($event)"
      />
    </div>
  `,
})
export class FilterComponent {
  @Input() public label = "Filter";
  @Input() public placeholder: string;
  @Output() public filter = new EventEmitter<string>();

  public onFilter(event: KeyboardEvent) {
    this.filter.next((event.target as HTMLInputElement).value);
  }
}
