import { Component, Input, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesList } from '../NotesList.component';
import { AuthService } from 'src/app/Services/AuthService';
import { Router } from '@angular/router';
import { DisplayModeService, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';
import { ListMenu, ListMenuItem } from '../../General/ListMenu/ListMenu.component';
import { NotesService } from 'src/app/Services/NotesService';

@Component({
  selector: 'SideMenu',
  standalone: true,
  imports: [CommonModule, ListMenu ],
  templateUrl: './SideMenu.component.html',
  styleUrls: ['./SideMenu.component.css']
})
export class SideMenu {
  @ViewChild(ListMenu) listMenu! : ListMenu;
  @Input() noteCount : number = 0;
  username : string = "";
  public static isProfileMenuVisible : boolean = false;

  profileMenuItems : ListMenuItem[] = [
    {content: "Logout", onClick: {func: this.Logout, src: this }},
    {content: "Settings", onClick: {func: this.Settings, src: this }, iconSrc: "/assets/CogIcon.svg"}
  ]

  constructor(private authService : AuthService, private router : Router) {
    effect(() => {
      this.authService.GetUsername().subscribe(username => this.username = username);
    })
  }

  ProfileOnClick(event : MouseEvent) {
    this.listMenu.ToggleVisibility();
    event.stopPropagation();
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
        console.log("Logout Result:", result)
        SideMenu.HideProfileMenu();
        DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.HIDDEN);
        this.router.navigate(['login']);
      }
    });
  }

  Settings() {
    this.router.navigate(['settings']);
    DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.HIDDEN);
  }
}
