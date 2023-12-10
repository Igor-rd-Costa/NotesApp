import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from 'src/app/Services/AuthService';
import { FormErrorBox, FormErrorCodes } from '../FormErrorBox/FormErrorBox.component';
import { FormButton } from '../FormButton/FormButton';
import { AbstractControl, FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'AuthPopUp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorBox, FormButton, NgIf],
  templateUrl: './AuthPopUp.component.html',
  styleUrls: ['./AuthPopUp.component.css']
})
export class AuthPopUp {
  @ViewChild(FormErrorBox) errorBox! : FormErrorBox;
  @ViewChild("submitButton") submitButton! : FormButton;
  constructor(private authService : AuthService) {
    this.form.statusChanges.subscribe(this.FormStatusChange.bind(this));
  }
  
  isVisible : boolean = false;
  message : string = "Confirm your password to proceed.";
  acceptText : string = "Confirm";
  form : FormGroup = new FormGroup({
    Password: new FormControl('', {validators: [Validators.required, Validators.minLength(8)]})
  })

  successCallback : () => void = () => {};
  Show(successCallback : () => void, message : string | null, acceptText : string | null) {
    this.isVisible = true;
    this.successCallback = successCallback;
    if (message)
      this.message = message;
    if (acceptText)
      this.acceptText = acceptText;
  }

  FormStatusChange(status : FormControlStatus) {
    if (status === "VALID") {
      this.submitButton.SetActiveState(true);
    } else {
      this.submitButton.SetActiveState(false);
    }
  }

  Hide() {
    this.isVisible = false;
    this.form.reset();
    this.successCallback = () => {};
    this.message = "Confirm your password to proceed.";
    this.acceptText = "Confirm";
  }

  Accept() {
    this.authService.CheckPassword(this.form.value.Password ?? "").subscribe({
      next: (isPasswordCorrect) => {
        if (isPasswordCorrect) {
          this.successCallback();
          this.Hide();
        } else {
          this.errorBox.ShowErrors(FormErrorCodes.INVALID_PASSWORD);
        }
      },
      error: (error) => {
        console.error("CheckPassword error:", error);
        this.Hide();
      }
    })
  }

  Cancel() {
    this.form.reset();
    this.errorBox.Hide();
    this.Hide();
  }
}
