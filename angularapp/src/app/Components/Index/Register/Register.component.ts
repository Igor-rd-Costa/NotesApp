import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDisplayMode, DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/Services/AuthService';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'Register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css']
})
export class Register {
  @Output() RegisterError : EventEmitter<number> = new EventEmitter<number>();
  constructor(private authService : AuthService) {}

  registerForm = new FormGroup({
    Username: new FormControl(''),
    Email: new FormControl(''),
    Password: new FormControl('')
  });

  Register() {
    this.authService.Register(
      this.registerForm.value.Username ?? '',
      this.registerForm.value.Email ?? '',
      this.registerForm.value.Password ?? ''
    ).subscribe({next: () => {
      DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    },
    error: (error : HttpErrorResponse) => {
      let errorCode : number = error.error;
      this.RegisterError.emit(errorCode);
  }})
  }

  Return() {
    DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.LOGIN);
  }
}
