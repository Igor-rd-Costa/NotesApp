import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/AuthService';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateDefaultButtonState } from 'src/app/Utils/GlobalEventHandlers';
import { FormButton } from '../../General/FormButton/FormButton';
import { Router } from '@angular/router';

@Component({
  selector: 'Register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormButton ],
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css']
})
export class Register implements AfterViewInit {
  @Output() RegisterError : EventEmitter<number> = new EventEmitter<number>();
  @ViewChild("registerButton") registerButton! : FormButton;
  constructor(private router : Router, private authService : AuthService) {
    this.registerForm.statusChanges.subscribe(this.OnStatusChange.bind(this));
  }

  registerForm = new FormGroup({
    Username: new FormControl('', {validators: [Validators.minLength(3), Validators.required]}),
    Email: new FormControl('', {validators: [Validators.email, Validators.required]}),
    Password: new FormControl('', {validators: [Validators.minLength(8), Validators.required]})
  });

  ngAfterViewInit(): void {
    UpdateDefaultButtonState();
  }

  Register() {
    this.authService.Register(
      this.registerForm.value.Username ?? '',
      this.registerForm.value.Email ?? '',
      this.registerForm.value.Password ?? ''
    ).subscribe({next: () => {
      this.router.navigate(['']);
    },
    error: (error : HttpErrorResponse) => {
      let errorCode : number = error.error;
      this.RegisterError.emit(errorCode);
  }})
  }

  Return() {
    this.router.navigate(['login']);
    DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.LOGIN);
  }

  OnStatusChange(status : FormControlStatus) {
    if (status === "VALID") {
      this.registerButton.SetActiveState(true);
    }
    else {
      this.registerButton.SetActiveState(false);
    }
  }
}
