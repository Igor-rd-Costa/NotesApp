import { AfterViewInit, Component, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { AuthService } from 'src/app/Services/AuthService';
import { FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateDefaultButtonState } from 'src/app/Utils/GlobalEventHandlers';
import { FormButton } from '../../General/FormButton/FormButton';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormErrorCodes } from '../../General/FormErrorBox/FormErrorBox.component';

@Component({
  selector: 'Login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormButton],
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class Login implements AfterViewInit {
  @Output() LoginError : EventEmitter<number> =  new EventEmitter<number>();

  @ViewChild("loginButton") loginButton! : FormButton;
  constructor(private router : Router, private authService : AuthService) {
    this.loginForm.statusChanges.subscribe(this.OnStatusChange.bind(this));
  }

  loginForm = new FormGroup({
    Username: new FormControl('', {validators: [Validators.required]}),
    Password: new FormControl('', {validators: [Validators.required]})
  })

  
  ngAfterViewInit(): void {
    UpdateDefaultButtonState();
  }

  Login() {
    this.authService.Login(
      this.loginForm.value.Username ?? '',
      this.loginForm.value.Password ?? ''
    ).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error : HttpErrorResponse) => {
        if (error.status === 401) {
          this.LoginError.emit(FormErrorCodes.INVALID_CREDENTIALS);
        }
        else if (error.status === 0) {
          this.LoginError.emit(FormErrorCodes.NO_CONNECTION);
        }
        else {
          console.error("Login error:", error);
        }
      }
    });
  }

  Register(event : MouseEvent) {
    this.router.navigate(['register']);
    DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.REGISTER);
  }

  OnStatusChange(status : FormControlStatus) {
    if (status === "VALID") {
      this.loginButton.SetActiveState(true);
    } else {
      this.loginButton.SetActiveState(false);
    }
  }
}
