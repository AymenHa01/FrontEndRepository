import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenemntComponent } from './evenemnt.component';

describe('EvenemntComponent', () => {
  let component: EvenemntComponent;
  let fixture: ComponentFixture<EvenemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvenemntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvenemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
