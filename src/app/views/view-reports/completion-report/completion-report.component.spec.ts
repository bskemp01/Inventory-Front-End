import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionReportComponent } from './completion-report.component';

describe('CompletionReportComponent', () => {
  let component: CompletionReportComponent;
  let fixture: ComponentFixture<CompletionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletionReportComponent]
    });
    fixture = TestBed.createComponent(CompletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
