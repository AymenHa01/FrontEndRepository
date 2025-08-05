import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiterComponent } from './actualiter.component';

describe('ActualiterComponent', () => {
  let component: ActualiterComponent;
  let fixture: ComponentFixture<ActualiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualiterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
