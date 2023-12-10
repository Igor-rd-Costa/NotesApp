import { Component, ViewChild, effect } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NotesList } from '../NotesList/NotesList.component';
import { Login } from './Login/Login.component';
import { Register } from './Register/Register.component';
import { DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { FormErrorBox } from '../General/FormErrorBox/FormErrorBox.component';

@Component({
  selector: 'Index',
  standalone: true,
  imports: [CommonModule, NotesList, Login, FormErrorBox, Register, NgIf],
  templateUrl: './Index.component.html',
  styleUrls: ['./Index.component.css']
})
export class Index {
  DisplayModeService = DisplayModeService;
  IndexDisplayMode = IndexDisplayMode;
  @ViewChild(FormErrorBox) errorBox! : FormErrorBox;

  constructor() {
      effect(() => {
        let displayMode = DisplayModeService.GetIndexDisplayMode();
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
