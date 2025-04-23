import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterprisePage } from './enterprise.page';

describe('EnterprisePage', () => {
  let component: EnterprisePage;
  let fixture: ComponentFixture<EnterprisePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterprisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
