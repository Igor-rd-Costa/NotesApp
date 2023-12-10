import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

export enum FormErrorCodes {
  NO_CONNECTION =                       -1,
  INVALID_CREDENTIALS =                  0,
  USERNAME_TAKEN =            0b0000000001, 
  EMAIL_TAKEN =               0b0000000010, 
  PASSWORD_SHORT =            0b0000000100, 
  PASSWORD_NO_ALPHANUMERIC =  0b0000001000, 
  PASSWORD_NO_DIGIT =         0b0000010000, 
  PASSWORD_NO_UPPER =         0b0000100000,
  PASSWORD_NO_LOWER =         0b0001000000,
  INVALID_USERNAME =          0b0010000000,
  INVALID_EMAIL =             0b0100000000,
  INVALID_PASSWORD =          0b1000000000
}

enum BoxState {
  ERROR_STATE, SUCCESS_STATE
}

@Component({
  selector: 'FormErrorBox',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './FormErrorBox.component.html',
  styleUrls: ['./FormErrorBox.component.css']
})
export class FormErrorBox {
  protected BoxState = BoxState;
  protected showBox : boolean = false;
  protected state : BoxState = BoxState.ERROR_STATE;
  protected messages : string[] = [];

  ShowErrors(errorCode : number) {
    this.messages = [];
    this.showBox = true;
    this.state = BoxState.ERROR_STATE;
    if (errorCode === FormErrorCodes.NO_CONNECTION) {
      this.messages.push("Could not establish a connection to the server.");
    }
    else if (errorCode === FormErrorCodes.INVALID_CREDENTIALS) {
      this.messages.push("Invalid credentials.");
    } else {
      if ((errorCode & FormErrorCodes.USERNAME_TAKEN) === FormErrorCodes.USERNAME_TAKEN) {
        this.messages.push("Username already taken.");
      }
      if ((errorCode & FormErrorCodes.EMAIL_TAKEN) === FormErrorCodes.EMAIL_TAKEN) {
        this.messages.push("Email already taken.");
      }
      if ((errorCode & FormErrorCodes.PASSWORD_SHORT) === FormErrorCodes.PASSWORD_SHORT) {
        this.messages.push("Password must contain at least 8 characters.");
      }
      if ((errorCode & FormErrorCodes.PASSWORD_NO_ALPHANUMERIC) === FormErrorCodes.PASSWORD_NO_ALPHANUMERIC) {
        this.messages.push("Password must contain a special character.");
      }
      if ((errorCode & FormErrorCodes.PASSWORD_NO_DIGIT) === FormErrorCodes.PASSWORD_NO_DIGIT) {
        this.messages.push("Password must contain a number.");
      }
      if ((errorCode & FormErrorCodes.PASSWORD_NO_UPPER) === FormErrorCodes.PASSWORD_NO_UPPER) {
        this.messages.push("Password must contain an upper case letter.");
      }
      if ((errorCode & FormErrorCodes.PASSWORD_NO_LOWER) === FormErrorCodes.PASSWORD_NO_LOWER) {
        this.messages.push("Password must contain a lower case letter.");
      }
      if ((errorCode & FormErrorCodes.INVALID_USERNAME) === FormErrorCodes.INVALID_USERNAME) {
        this.messages.push("Invalid username.");
      }
      if ((errorCode & FormErrorCodes.INVALID_EMAIL) === FormErrorCodes.INVALID_EMAIL) {
        this.messages.push("Invalid email.");
      }
      if ((errorCode & FormErrorCodes.INVALID_PASSWORD) === FormErrorCodes.INVALID_PASSWORD) {
        this.messages.push("Invalid password.");
      }
    } 
  }

  ShowSuccess(msg : string) {
    this.showBox = true;
    this.messages = [];
    this.state = BoxState.SUCCESS_STATE;
    this.messages.push(msg);
  }

  Hide() {
    this.showBox = false;
    this.messages = [];
  }
}
