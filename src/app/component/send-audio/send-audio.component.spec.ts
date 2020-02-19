import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let component: SendAudioComponent;
  let fixture: ComponentFixture<SendAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendAudioComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
