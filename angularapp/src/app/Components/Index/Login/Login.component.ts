import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDisplayMode, DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { AuthService } from 'src/app/Services/AuthService';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'Login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class Login {
  AppDisplayMode = AppDisplayMode;
  constructor(private authService : AuthService) {}

  loginForm = new FormGroup({
    Username: new FormControl(''),
    Password: new FormControl('')
  })

  Login() {
    this.authService.Login(
      this.loginForm.value.Username ?? '',
      this.loginForm.value.Password ?? ''
    ).then(status => {
      if (status)
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
    });
  }

  Register() {
    DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.REGISTER);
  }
}
