import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import 'rxjs/add/operator/filter';
import {  Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

const emailValidator = Validators.pattern('^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$');

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public form: FormGroup;
  public contactName = new FormControl('');
  public contactPhoneOne = new FormControl('', Validators.required);
  public contactPhoneTwo = new FormControl('');
  public contactAddress = new FormControl('');
  public contactEmail = new FormControl('', emailValidator);

  constructor(router: Router, titleService: Title, private fb: FormBuilder) {
    
   }

  ngOnInit() {
    this.form = this.fb.group({
      contactName : ['', Validators.required ],
      contactPhoneOne: ['',  Validators.required],
      contactPhoneTwo: [''],
      contactEmail: [''],
      contactAddress: ['']
    });
    
    this.form.valueChanges
      .subscribe((formValues) => {
        formValues.contactName = formValues.contactName.toUpperCase();
        return formValues;
      });
      /*.filter((formValues) => this.form.valid)
      .subscribe((formValues) => {
        console.log(`Model Driven Form valid: ${this.form.valid} value:`, JSON.stringify(formValues));
      });*/    
  }

}
