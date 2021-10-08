import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAddDialogComponent } from './organisation-add-dialog.component';

describe('OrganisationAddDialogComponent', () => {
  let component: OrganisationAddDialogComponent;
  let fixture: ComponentFixture<OrganisationAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationAddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
