import { Component, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule, NgIf, NgSwitch } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../General/ImgButton/ImgButton.component';
import { Router } from '@angular/router';
import { DisplayModeService, SettingsDisplayMode } from 'src/app/Services/DisplayModeService';
import { ProfileSettings } from './ProfileSettings/ProfileSettings.component';
import { NewNotesSettings } from './NewNotesSettings/NewNotesSettings.component';
import { NotesSettings } from './NotesSettings/NotesSettings.component';
import { NoteSettings } from './NoteSettings/NoteSettings.component';
import { RouteService } from 'src/app/Services/RouteService';


//TODO make all of this look good on mobile
@Component({
  selector: 'Settings',
  standalone: true,
  imports: [CommonModule, ImgButton, NgIf, NgSwitch, ProfileSettings, NewNotesSettings, NotesSettings, NoteSettings ],
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class Settings {
  SettingsDisplayMode = SettingsDisplayMode;
  displayMode = SettingsDisplayMode.PROFILE_SETTINGS;
  parentRoute : string = "";

  lastRoute = "";
  @ViewChild("itemList") items! : ElementRef;
  constructor(private router : Router) {

    const lastRoute = RouteService.GetLastRoute();
    if (!lastRoute.startsWith("/settings")) {
      this.lastRoute = lastRoute;
    }

    if (this.router.url.startsWith("/settings/note/")) {
      DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.NOTE_SETTINGS);
    }
    else {
      switch(this.router.url) {
        case "/settings/profile": {
          DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.PROFILE_SETTINGS);
        } break;
        case "/settings/new-notes": {
          DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.NEW_NOTES_SETTINGS);
        } break;
        case "/settings/notes": {
          DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.NOTES_SETTINGS);
        } break;
      }
    }


    effect(() => {
      this.displayMode = DisplayModeService.GetSettingsDisplayMode();
    })
  }

  backButtonProps: ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/BackArrow.png",
      Alt: "Back button"
    }
  }

  OnBackButtonClick(event : MouseEvent) {
    this.router.navigateByUrl(this.lastRoute);
  }

  OnSelect(event : MouseEvent | TouchEvent) {
    if (event.target === null)
      return;

    const item = (event.target as HTMLElement).closest("LI") as HTMLLIElement;
    if (item.classList.contains("selected"))
      return;

    switch(item.id) {
      case "profile-settings": {
        DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.PROFILE_SETTINGS);
        this.router.navigate(['settings', 'profile']);
      } break;
      case "new-notes-settings": {
        DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.NEW_NOTES_SETTINGS);
        this.router.navigate(['settings', 'new-notes']);
      } break;
      case "notes-settings": {
        DisplayModeService.SetSettingsDisplayMode(SettingsDisplayMode.NOTES_SETTINGS);
        this.router.navigate(['settings', 'notes']);
      } break;
      default: {
        console.error("Action for menu item %s not implemented", item.id);
      }
    }
     
  }

}
