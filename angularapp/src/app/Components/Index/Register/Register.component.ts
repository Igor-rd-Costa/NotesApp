import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDisplayMode, DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/Services/AuthService';

@Component({
  selector: 'Register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css']
})
export class Register {

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
    ).then(registered => {
      console.log(registered);
      if(registered)
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    })
  }

  Return() {
    DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.LOGIN);
  }
}
