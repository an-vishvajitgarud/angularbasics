import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-builder',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.css'
})
export class FormBuilderComponent {
  //alternate method for Formbuilder constructure

  // userform: FormGroup;
  // constructor(private fb:FormBuilder){
  //   this.userform = this.fb.group({})
  // }


  private fb = inject(FormBuilder);
  
  userform = this.fb.group({
    fullName: ['',[Validators.required, Validators.minLength(3)]],
    username: ['',[Validators.required, Validators.minLength(3)]],
    email: ['',[Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(6)]],
    confirmPassword:['',[Validators.required]],
    acceptTerms:[false,[Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator })

//I used custom validator confirmpassword.
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  get fullName() { return this.userform.get('fullName'); }
  get username() { return this.userform.get('username'); }
  get email() { return this.userform.get('email'); }
  get password() { return this.userform.get('password'); }
  get confirmPassword() { return this.userform.get('confirmPassword'); }
  get acceptTerms() { return this.userform.get('acceptTerms'); }

  onSubmit() {
    if (this.userform.valid) {
      console.log('Registered User:', this.userform.value);
      this.userform.reset();
    }
  }
  onReset() {
    this.userform.reset();
  }
}
