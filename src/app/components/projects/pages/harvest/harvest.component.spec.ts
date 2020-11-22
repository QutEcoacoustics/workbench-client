import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarvestComponent } from './harvest.component';

xdescribe('HarvestComponent', () => {
  let component: HarvestComponent;
  let fixture: ComponentFixture<HarvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
