import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesList } from '../NotesList.component';
import { AuthService } from 'src/app/Services/AuthService';
import { Router } from '@angular/router';
import { AppDisplayMode, DisplayModeService, IndexDisplayMode, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';

@Component({
  selector: 'SideMenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './SideMenu.component.html',
  styleUrls: ['./SideMenu.component.css']
})
export class SideMenu {
  noteCount : number = 0;
  username : string = "";
  public static isProfileMenuVisible : boolean = false;

  constructor(private authService : AuthService, private router : Router) {
    effect(() => {
      this.noteCount = NotesList.GetNoteCount();
      this.authService.GetUsername().subscribe(username => this.username = username);
    })
  }

  ProfileOnClick(event : MouseEvent) {
    SideMenu.ShowProfileMenu(event);
  }

  public static ShowProfileMenu(event : MouseEvent) {
    const profileMenu = document.getElementById("profile-menu") as HTMLElement;
    if (profileMenu != null && !SideMenu.isProfileMenuVisible) {
      event.stopPropagation();
      profileMenu.style.left = event.clientX + 32 + "px";
      profileMenu.style.top = event.clientY - 16 + "px";
      profileMenu.style.visibility = "visible";
      SideMenu.isProfileMenuVisible = true;
    }
  }

  public static HideProfileMenu() {
    const profileMenu = document.getElementById("profile-menu") as HTMLElement;
    if (profileMenu != null) {
      profileMenu.style.visibility = "hidden";
      profileMenu.style.left = "0px";
      profileMenu.style.top = "0px";
      SideMenu.isProfileMenuVisible = false;
    }
  }

  Logout() {
    this.authService.Logout().subscribe(result => {
      if (result) {
        SideMenu.HideProfileMenu();
        DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.HIDDEN);
        DisplayModeService.SetAppDisplayMode(AppDisplayMode.INDEX_DISPLAY);
        DisplayModeService.SetIndexDisplayMode(IndexDisplayMode.LOGIN);
      }
    });
  }
}
