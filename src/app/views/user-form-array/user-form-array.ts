import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userUniqueEmail } from '../../shared/validators/user-unique-email.validator';

@Component({
  selector: 'app-user-form-array',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form-array.html',
  styleUrl: './user-form-array.css'
})
export class UserFormArray {
  userForm!: FormGroup;
  private isSubmitted = false;

  constructor(private fb: FormBuilder){
    this.userForm = this.fb.group({
      user: this.fb.array([])
    });
  }

  get userFormArray(): FormArray{
    return this.userForm.get('user') as FormArray
  }

  addUserForm(): FormGroup{
    return this.fb.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email, userUniqueEmail]],
      age: ['',[Validators.required, Validators.min(10)]]
    })
  }

  addUserBtnClicked(){
    const user = this.addUserForm();
    this.isSubmitted = false;
    this.userFormArray.push(user);
  }

  deleteUserForm(index: number){
    if(this.userFormArray.length > 0){
      this.userFormArray.removeAt(index);
    }
  }

  submit(){
    this.isSubmitted = true;
    console.log(this.userForm.value);
  }

  canDeactivate(): boolean {
    debugger
    if (this.userForm.dirty && !this.isSubmitted) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}
