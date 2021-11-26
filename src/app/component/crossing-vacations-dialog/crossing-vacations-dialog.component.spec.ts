import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossingVacationsDialogComponent } from './crossing-vacations-dialog.component';

describe('CrossingVacationsDialogComponent', () => {
  let component: CrossingVacationsDialogComponent;
  let fixture: ComponentFixture<CrossingVacationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossingVacationsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossingVacationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
