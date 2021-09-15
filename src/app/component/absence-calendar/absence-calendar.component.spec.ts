import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceCalendarComponent } from './absence-calendar.component';

describe('AbsenceCalendarComponent', () => {
  let component: AbsenceCalendarComponent;
  let fixture: ComponentFixture<AbsenceCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
