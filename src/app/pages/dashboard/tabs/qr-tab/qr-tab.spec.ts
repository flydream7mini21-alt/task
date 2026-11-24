import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrTab } from './qr-tab';

describe('QrTab', () => {
  let component: QrTab;
  let fixture: ComponentFixture<QrTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrTab],
    }).compileComponents();

    fixture = TestBed.createComponent(QrTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
