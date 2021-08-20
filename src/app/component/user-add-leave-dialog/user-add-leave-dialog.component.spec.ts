import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddLeaveDialogComponent } from './user-add-leave-dialog.component';

describe('UserAddLeaveDialogComponent', () => {
  let component: UserAddLeaveDialogComponent;
  let fixture: ComponentFixture<UserAddLeaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAddLeaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
