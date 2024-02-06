import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../../../General/ImgButton/ImgButton.component';
import { FormButton } from '../../../General/FormButton/FormButton';
import { AbstractControl, FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/AuthService';
import { FormErrorBox } from '../../../General/FormErrorBox/FormErrorBox.component';
import { Router } from '@angular/router';
import { EditableDataField } from './EditableDataField/EditableDataField.component';
import { AuthPopUp } from '../../..//General/AuthPopUp/AuthPopUp.component';

@Component({
  selector: 'ProfileSettings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthPopUp, ImgButton, FormButton, EditableDataField, FormErrorBox],
  templateUrl: './ProfileSettings.component.html',
  styleUrls: ['./ProfileSettings.component.css']
})
export class ProfileSettings {

  @ViewChild("usernameField") usernameField! : EditableDataField;
  @ViewChild("emailField") emailField! : EditableDataField;
  @ViewChild("changePasswordErrorBox") changePasswordErrorBox! : FormErrorBox;
  @ViewChild("changePasswordButton") changePasswordButton! : FormButton;
  @ViewChild("deleteAccountButton") deleteAccountButton! : FormButton;
  @ViewChild(AuthPopUp) authPopUp! : AuthPopUp;
  username : string = "";
  email : string = "";
  editButtonProps : ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/EditIcon.svg"
    }
  }

  changePasswordForm : FormGroup = new FormGroup({
    OldPassword: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(8)]}),
    NewPassword: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(8)]})
  })

  deleteAccountForm : FormGroup = new FormGroup({
    Password: new FormControl<string>('')
  })

  constructor(private authService : AuthService, private router : Router) {
    this.authService.GetUsername().subscribe(value => {
      this.username = value;
    });
    this.authService.GetEmail().subscribe({
      next: (response) => {
        this.email = response;
      },
      error: (error) => {
        console.error("GetEmail error:", error);
      }
    });

    this.changePasswordForm.statusChanges.subscribe(this.OnPasswordFormStatusChange.bind(this))
  }

  ValidateUsername(control : AbstractControl) {
    return new Promise<ValidationErrors | null>((resolve => {
      if (control.status !== "INVALID") {
        this.authService.CheckUsername(control.value).subscribe({
          next: (isAvailable) => {
            if (isAvailable)
              resolve(null);
            else
              resolve({unavailable: false});
          },
          error: (error) => {
            console.error("CheckUsername error:", error);
          }
        });
      }
    }));
  }

  ValidateEmail(control : AbstractControl) {
    return new Promise<ValidationErrors | null>((resolve => {
      if (control.status !== "INVALID") {
        this.authService.CheckEmail(control.value).subscribe({
          next: (isAvailable) => {
            if (isAvailable)
              resolve(null);
            else
              resolve({unavailable: true});
          },
          error: (error) => {
            console.error("CheckEmail error:", error);
          }
        })
      }
    }));
  }

  SaveUsername(username : string) {
    this.authPopUp.Show(() => {
      this.authService.ChangeUsername(username).subscribe({
        next: () => {
          this.usernameField.ConfirmEdit();
        },
        error: (error) => {
          console.error("SaveUsername error:", error);
        }
      })
    }, "Confirm your password bellow to update your username.", "Update");

  }

  SaveEmail(email : string) {
    this.authPopUp.Show(() => {
      this.authService.ChangeEmail(email).subscribe({
        next: () => {
          this.emailField.ConfirmEdit();
        },
        error: (error) => {
          console.error("SaveEmail error:", error);
        }
      })
    }, "Confirm your password bellow to update your email.", "Update")
  }

  OnPasswordFormStatusChange(status : FormControlStatus) {
    if (status === "INVALID") {
      this.changePasswordButton.SetActiveState(false);
    } else if (status === "VALID") {
      this.changePasswordButton.SetActiveState(true);
    }
  }

  ShowDeleteAccountPopUp() {
    this.authPopUp.Show(this.DeleteAccount.bind(this), "This action is permanent. All your data will be lost.", "Delete");
  }

  ChangePassword() {
    this.authService.ChangePassword(
      this.changePasswordForm.value.OldPassword ?? '',
      this.changePasswordForm.value.NewPassword ?? ''
    ).subscribe({next: () => {
      this.changePasswordErrorBox.ShowSuccess("Password changed successfully!");
      this.changePasswordForm.reset();
      setTimeout(() => {
        this.changePasswordErrorBox.Hide();
      }, 3000);
    },
    error: (error) => {
      if (error.error === 0)
        return;
      this.changePasswordErrorBox.ShowErrors(error.error);
    }})
  }

  DeleteAccount() {
    this.authService.DeleteAccount().subscribe({
      next: () => {
        this.router.navigate(['login']);
      }, 
      error: (error) => {
        console.error("DeleteAccount error:", error);
      }
    });
  }
}
