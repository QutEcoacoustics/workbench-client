import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCreditsComponent } from './credits.component';

describe('ContactCreditsComponent', () => {
  let component: ContactCreditsComponent;
  let fixture: ComponentFixture<ContactCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactCreditsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
