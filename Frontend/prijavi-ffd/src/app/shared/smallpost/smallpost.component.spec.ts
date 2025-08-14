import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallPostComponent } from './smallpost.component';

describe('SmallpostComponent', () => {
  let component: SmallPostComponent;
  let fixture: ComponentFixture<SmallPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
