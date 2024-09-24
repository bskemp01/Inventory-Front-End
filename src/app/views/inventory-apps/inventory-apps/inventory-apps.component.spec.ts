import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAppsComponent } from './inventory-apps.component';

describe('InventoryAppsComponent', () => {
  let component: InventoryAppsComponent;
  let fixture: ComponentFixture<InventoryAppsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryAppsComponent]
    });
    fixture = TestBed.createComponent(InventoryAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
