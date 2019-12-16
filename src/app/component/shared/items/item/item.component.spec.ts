import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { ItemsItemComponent } from "./item.component";

describe("ItemsItemComponent", () => {
  let component: ItemsItemComponent;
  let fixture: ComponentFixture<ItemsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ItemsItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
