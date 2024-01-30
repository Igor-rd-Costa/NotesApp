import { Component, ViewChild, effect } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NotesList } from '../NotesList/NotesList.component';
import { Login } from './Login/Login.component';
import { Register } from './Register/Register.component';
import { DisplayModeService } from 'src/app/Services/DisplayModeService';
import { FormErrorBox } from '../General/FormErrorBox/FormErrorBox.component';
import { ActivatedRoute } from '@angular/router';

enum IndexDisplayMode {
  LOGIN, REGISTER
}

@Component({
  selector: 'Index',
  standalone: true,
  imports: [CommonModule, NotesList, Login, FormErrorBox, Register, NgIf],
  templateUrl: './Index.component.html',
  styleUrls: ['./Index.component.css']
})
export class Index {
  IndexDisplayMode = IndexDisplayMode;
  displayMode = IndexDisplayMode.LOGIN;
  @ViewChild(FormErrorBox) errorBox! : FormErrorBox;

  constructor(private route : ActivatedRoute) {
      this.route.url.subscribe(urlSegments => {
        const path = urlSegments[0].path;
        if (path === "login" && this.displayMode !== IndexDisplayMode.LOGIN) {
          this.displayMode = IndexDisplayMode.LOGIN
        } 
        else if (path === "register" && this.displayMode !== IndexDisplayMode.REGISTER) {
          this.displayMode = IndexDisplayMode.REGISTER;
        }
      })
      effect(() => {
        if (this.errorBox) {
          this.errorBox.Hide();
        }
      })
  }

  HandleError(errorCode : number) {
    if (this.errorBox) {
      this.errorBox.ShowErrors(errorCode);
    }
  }
}
