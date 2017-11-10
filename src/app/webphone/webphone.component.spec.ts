/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WebphoneComponent } from './webphone.component';

describe('WebphoneComponent', () => {
  let component: WebphoneComponent;
  let fixture: ComponentFixture<WebphoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebphoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebphoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
