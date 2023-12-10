import { AfterViewInit, Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../General/ImgButton/ImgButton.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayModeService } from 'src/app/Services/DisplayModeService';
import { ProfileSettings } from './ProfileSettings/ProfileSettings.component';
import { NewNotesSettings } from './NewNotesSettings/NewNotesSettings.component';
import { NotesSettings } from './NotesSettings/NotesSettings.component';

enum SettingsDisplayMode {
  PROFILE_SETTINGS, NEW_NOTES_SETTINGS, NOTES_SETTINGS
}

@Component({
  selector: 'Settings',
  standalone: true,
  imports: [CommonModule, ImgButton, NgIf, ProfileSettings, NewNotesSettings, NotesSettings ],
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class Settings {
  SettingsDisplayMode = SettingsDisplayMode;
  displayMode = SettingsDisplayMode.PROFILE_SETTINGS;

  @ViewChild("itemList") items! : ElementRef;
  constructor(private router : Router, private route : ActivatedRoute,) {
    if (this.router.url !== "/settings/profile") {
      switch(this.router.url) {
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
    this.router.navigate(['']);
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
