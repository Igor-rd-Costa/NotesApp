import { Component, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NotesList } from '../NotesList/NotesList.component';
import { Login } from './Login/Login.component';
import { Register } from './Register/Register.component';
import { AppDisplayMode, DisplayModeService, IndexDisplayMode } from 'src/app/Services/DisplayModeService';
import { AuthService } from 'src/app/Services/AuthService';

@Component({
  selector: 'Index',
  standalone: true,
  imports: [CommonModule, NotesList, Login, Register, NgIf],
  templateUrl: './Index.component.html',
  styleUrls: ['./Index.component.css']
})
export class Index {
  DisplayModeService = DisplayModeService;
  AppDisplayMode = AppDisplayMode;
  IndexDisplayMode = IndexDisplayMode;

  constructor(authService : AuthService) {
      authService.IsLogged().subscribe(isLoggedIn => {
        if (isLoggedIn) {
          DisplayModeService.SetAppDisplayMode(AppDisplayMode.NOTE_LIST);
        }
      })
  }
}
