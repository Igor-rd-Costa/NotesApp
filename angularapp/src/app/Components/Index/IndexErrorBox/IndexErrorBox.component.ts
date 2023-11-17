import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

export enum IndexErrorType {
  INVALID_CREDENTIALS,
  USERNAME_TAKEN =            0b000000001, 
  EMAIL_TAKEN =               0b000000010, 
  PASSWORD_SHORT =            0b000000100, 
  PASSWORD_NO_ALPHANUMERIC =  0b000001000, 
  PASSWORD_NO_DIGIT =         0b000010000, 
  PASSWORD_NO_UPPER =         0b000100000,
  PASSWORD_NO_LOWER =         0b001000000,
  INVALID_USERNAME =          0b010000000,
  INVALID_EMAIL =             0b100000000
}

@Component({
  selector: 'IndexErrorBox',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './IndexErrorBox.component.html',
  styleUrls: ['./IndexErrorBox.component.css']
})
export class IndexErrorBox {
  showError : boolean = false;
  errorMessages : string[] = [];

  ShowErrors(errorCode : number) {
    this.errorMessages = [];
    this.showError = true;
    if (errorCode === IndexErrorType.INVALID_CREDENTIALS) {
      this.errorMessages.push("Invalid credentials.");
    } else {
      if ((errorCode & IndexErrorType.USERNAME_TAKEN) === IndexErrorType.USERNAME_TAKEN) {
        this.errorMessages.push("Username already taken.");
      }
      if ((errorCode & IndexErrorType.EMAIL_TAKEN) === IndexErrorType.EMAIL_TAKEN) {
        this.errorMessages.push("Email already taken.");
      }
      if ((errorCode & IndexErrorType.PASSWORD_SHORT) === IndexErrorType.PASSWORD_SHORT) {
        this.errorMessages.push("Password must contain at least 8 characters.");
      }
      if ((errorCode & IndexErrorType.PASSWORD_NO_ALPHANUMERIC) === IndexErrorType.PASSWORD_NO_ALPHANUMERIC) {
        this.errorMessages.push("Password must contain a special character.");
      }
      if ((errorCode & IndexErrorType.PASSWORD_NO_DIGIT) === IndexErrorType.PASSWORD_NO_DIGIT) {
        this.errorMessages.push("Password must contain a number.");
      }
      if ((errorCode & IndexErrorType.PASSWORD_NO_UPPER) === IndexErrorType.PASSWORD_NO_UPPER) {
        this.errorMessages.push("Password must contain an upper case letter.");
      }
      if ((errorCode & IndexErrorType.PASSWORD_NO_LOWER) === IndexErrorType.PASSWORD_NO_LOWER) {
        this.errorMessages.push("Password must contain a lower case letter.");
      }
      if ((errorCode & IndexErrorType.INVALID_USERNAME) === IndexErrorType.INVALID_USERNAME) {
        this.errorMessages.push("Invalid username.");
      }
      if ((errorCode & IndexErrorType.INVALID_EMAIL) === IndexErrorType.INVALID_EMAIL) {
        this.errorMessages.push("Invalid email.");
      }
    } 
  }

  HideErrors() {
    this.showError = false;
    this.errorMessages = [];
  }
}
