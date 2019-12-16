import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
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
  });

  it("should create", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = 0;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display icon", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = 0;

    fixture.detectChanges();
    const icon = fixture.debugElement.nativeElement.querySelector("fa-icon");
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop")).toBeTruthy();
    expect(icon.attributes.getNamedItem("ng-reflect-icon-prop").value).toBe(
      "fas,home"
    );
  });

  it("should display name", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = 0;

    fixture.detectChanges();
    const name = fixture.debugElement.nativeElement.querySelector("#name");
    expect(name).toBeTruthy();
    expect(name.innerText.trim()).toBe("Test");
  });

  it("should display number value", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = 0;

    fixture.detectChanges();
    const value = fixture.debugElement.nativeElement.querySelector("#value");
    expect(value).toBeTruthy();
    expect(value.innerText.trim()).toBe("0");
  });

  it("should display random number value", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = 42;

    fixture.detectChanges();
    const value = fixture.debugElement.nativeElement.querySelector("#value");
    expect(value).toBeTruthy();
    expect(value.innerText.trim()).toBe("42");
  });

  it("should display string value", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = "0";

    fixture.detectChanges();
    const value = fixture.debugElement.nativeElement.querySelector("#value");
    expect(value).toBeTruthy();
    expect(value.innerText.trim()).toBe("0");
  });

  it("should display random string value", () => {
    component.icon = ["fas", "home"] as IconProp;
    component.name = "Test";
    component.value = "random";

    fixture.detectChanges();
    const value = fixture.debugElement.nativeElement.querySelector("#value");
    expect(value).toBeTruthy();
    expect(value.innerText.trim()).toBe("random");
  });
});
