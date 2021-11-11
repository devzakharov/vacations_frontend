import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationUserEditDialogComponent } from './vacation-user-edit-dialog.component';

describe('VacationUserEditDialogComponent', () => {
  let component: VacationUserEditDialogComponent;
  let fixture: ComponentFixture<VacationUserEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationUserEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationUserEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
