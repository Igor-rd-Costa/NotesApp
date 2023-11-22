import { AfterViewInit, Component, EventEmitter, Output, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDisplayMode, DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { AuthService } from 'src/app/Services/AuthService';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IndexErrorType } from '../IndexErrorBox/IndexErrorBox.component';
import { UpdateDefaultButtonState } from 'src/app/Utils/GlobalEventHandlers';
import { FormButton } from '../../General/FormButton/FormButton';

@Component({
  selector: 'Login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormButton],
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class Login implements AfterViewInit {
  AppDisplayMode = AppDisplayMode;
  @Output() LoginError : EventEmitter<number> =  new EventEmitter<number>();

  @ViewChildren(FormButton) formButtons! : FormButton[];
  constructor(private authService : AuthService) {}

  loginForm = new FormGroup({
    Username: new FormControl(''),
    Password: new FormControl('')
  })

  
  ngAfterViewInit(): void {
    UpdateDefaultButtonState();
  }

  Login() {
    this.authService.Login(
      this.loginForm.value.Username ?? '',
      this.loginForm.value.Password ?? ''
    ).then(status => {
      if (status)
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
      else
        this.LoginError.emit(IndexErrorType.INVALID_CREDENTIALS);
    });
  }

  Register(event : MouseEvent) {
    DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.REGISTER);
  }

  OnKeyUp(event : Event) {
    const buttonState = FormButton.UpdateFormButtonState(event);
    this.formButtons.forEach(button => {
      if (button.type === "submit") {
        button.SetActiveState(buttonState);
      }
    })
  }

  Test() {
    this.formButtons.forEach(button => {
      if (button.type === "submit") {
        button.SetActiveState(true);
      }
    })
  }
}
