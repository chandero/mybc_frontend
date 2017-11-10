/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VoicemailComponent } from './voicemail.component';

describe('VoicemailComponent', () => {
  let component: VoicemailComponent;
  let fixture: ComponentFixture<VoicemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
