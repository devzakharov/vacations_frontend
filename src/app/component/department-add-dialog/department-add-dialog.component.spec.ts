import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAddDialogComponent } from './department-add-dialog.component';

describe('DepartmentAddDialogComponent', () => {
  let component: DepartmentAddDialogComponent;
  let fixture: ComponentFixture<DepartmentAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentAddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
