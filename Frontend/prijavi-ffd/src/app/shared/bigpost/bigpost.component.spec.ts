import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigPostComponent } from './bigpost.component';

describe('BigpostComponent', () => {
  let component: BigPostComponent;
  let fixture: ComponentFixture<BigPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
