import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousAtelierComponent } from './sous-atelier.component';

describe('SousAtelierComponent', () => {
  let component: SousAtelierComponent;
  let fixture: ComponentFixture<SousAtelierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SousAtelierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SousAtelierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
