/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FollowmeComponent } from './followme.component';

describe('FollowmeComponent', () => {
  let component: FollowmeComponent;
  let fixture: ComponentFixture<FollowmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
