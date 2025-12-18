import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  merge,
  Observable,
  OperatorFunction,
  Subject,
  switchMap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "baw-model-selector",
  template: `
    <div class="input-group">
      @if (label) {
        <div class="input-group-prepend input-group-text">
          {{ label }}
        </div>
      }
      <input
        #selector="ngbTypeahead"
        type="text"
        class="form-select"
        container="body"
        [placeholder]="placeholder ?? ''"
        [ngbTypeahead]="search$"
        [resultFormatter]="formatModel"
        [resultTemplate]="resultTemplate"
        [inputFormatter]="formatModel"
        [editable]="false"
        [ngModel]="model"
        (focus)="focus$.next($any($event.target).value)"
        (selectItem)="modelChange.emit($event.item)"
        (ngModelChange)="modelChange.emit($event)"
      />
    </div>
  `,
  imports: [NgbTypeahead, FormsModule],
})
export class ModelSelectorComponent<Model extends AbstractModel>
  implements OnInit
{
  @ViewChild("selector", { static: true }) public selector: NgbTypeahead;

  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public model: Model;
  @Input() public getModels: (input: Model | string) => Observable<Model[]>;
  @Input() public formatter: (model: AbstractModel) => string;
  @Input() public resultTemplate: NgbTypeahead["resultTemplate"];
  @Output() public modelChange = new EventEmitter<Model>();

  public focus$ = new Subject<Model>();
  public click$ = new Subject<Model>();
  public search$: OperatorFunction<string, readonly Model[]>;

  public ngOnInit(): void {
    this.search$ = (text$: Observable<string>): Observable<Model[]> => {
      const debouncedText$ = text$.pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged()
      );
      const clicksWithClosedPopup$ = this.click$.pipe(
        filter((): boolean => !this.selector.isPopupOpen())
      );
      const inputFocus$ = this.focus$;

      return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
        switchMap((model: Model | string) => this.getModels(model))
      );
    };
  }

  public formatModel = (model: AbstractModel): string =>
    this.formatter?.(model) ??
    (model as Site | Project | Region)?.name ??
    (model as User)?.userName ??
    model.toString();
}
