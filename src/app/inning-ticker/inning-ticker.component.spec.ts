import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InningTickerComponent } from './inning-ticker.component';

describe('InningTickerComponent', () => {
  let component: InningTickerComponent;
  let fixture: ComponentFixture<InningTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InningTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InningTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
