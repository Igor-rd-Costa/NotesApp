import { signal } from "@angular/core";
import AnimateElement from "../Utils/Animate";
import { ResetTouchInfoData, touchInfo } from "../Utils/GlobalEventHandlers";

export enum HeaderDisplayMode {
  HEADER_LARGE, HEADER_HIDDEN
}

export enum NoteDisplayMode {
  DISPLAY, EDIT
}

export enum SideMenuDisplayMode {
  HIDDEN, VISIBLE
}

export enum SettingsDisplayMode {
  PROFILE_SETTINGS, NEW_NOTES_SETTINGS, NOTES_SETTINGS, NOTE_SETTINGS
}

export class DisplayModeService 
{
  private static headerDisplayMode = signal<HeaderDisplayMode>(HeaderDisplayMode.HEADER_LARGE);
  private static noteDisplayMode = signal<NoteDisplayMode>(NoteDisplayMode.DISPLAY);
  private static sideMenuDisplayMode = signal<SideMenuDisplayMode>(SideMenuDisplayMode.HIDDEN);
  private static settingsDisplayMode = signal<SettingsDisplayMode>(SettingsDisplayMode.PROFILE_SETTINGS);

  public static SetNoteDisplayMode(mode : NoteDisplayMode) : void {
    DisplayModeService.noteDisplayMode.set(mode);
  }

  public static GetNoteDisplayMode() : NoteDisplayMode {
    return DisplayModeService.noteDisplayMode();
  }

  public static SetHeaderDisplayMode(mode: HeaderDisplayMode) : void {
    DisplayModeService.headerDisplayMode.set(mode);
  }

  public static GetHeaderDisplayMode(): HeaderDisplayMode {
    return DisplayModeService.headerDisplayMode();
  }

  public static GetSideMenuDisplayMode() : SideMenuDisplayMode {
    return DisplayModeService.sideMenuDisplayMode();
  }

  public static SetSideMenuDisplayMode(mode : SideMenuDisplayMode) : void {
    DisplayModeService.sideMenuDisplayMode.set(mode);
  }

  public static GetSettingsDisplayMode() : SettingsDisplayMode {
    return DisplayModeService.settingsDisplayMode();
  }

  public static SetSettingsDisplayMode(mode : SettingsDisplayMode) : void {
    DisplayModeService.settingsDisplayMode.set(mode);
  }

  public static NotesListDisplayMode = {
    ShowSideMenu: () => {
      const sideMenu = document.getElementById("side-menu") as HTMLElement;
      const createNoteButton = document.getElementById("create-note") as HTMLElement;
      const main = document.getElementById("notes-main") as HTMLElement;
      const wrapper = document.getElementById("notes-list-wrapper") as HTMLElement;
      let windowWidth = window.innerWidth;
      if (windowWidth > 345)
        windowWidth = 345;

      if (sideMenu == null || createNoteButton == null || main == null || wrapper == null) 
        return;

      main.style.overflow = "hidden";
      const rightValue = parseFloat(getComputedStyle(createNoteButton).right);
      AnimateElement(createNoteButton, { right: rightValue + 'px' }, { right: rightValue - (windowWidth * 0.8435) + 'px' }, 175);
      AnimateElement(wrapper, { backgroundColor: "#222222FF" }, { backgroundColor: "#202020FF" }, 175);
      AnimateElement(sideMenu, { width: "0px" }, { width: (windowWidth * 0.8435) + 'px' }, 175).addEventListener('finish', () => {
        DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.VISIBLE);
      });
    },

    HideSideMenu: () => {
      const sideMenu = document.getElementById("side-menu") as HTMLElement;
      const createNoteButton = document.getElementById("create-note") as HTMLElement;
      const main = document.getElementById("notes-main") as HTMLElement;
      const wrapper = document.getElementById("notes-list-wrapper") as HTMLElement;    
      if (sideMenu == null || createNoteButton == null || main == null || wrapper == null) 
        return;
  
      let windowWidth = window.innerWidth;
      if (windowWidth > 345)
        windowWidth = 345;
      
      if (DisplayModeService.GetHeaderDisplayMode() === HeaderDisplayMode.HEADER_HIDDEN) 
        main.style.overflow = "scroll";

      const rightValue = parseFloat(getComputedStyle(createNoteButton).right);
      AnimateElement(createNoteButton, { right: rightValue + 'px' }, { right: rightValue + (windowWidth * 0.8435) + "px" }, 175);
      AnimateElement(wrapper, { backgroundColor: "#202020FF" }, { backgroundColor: "#222222FF" }, 175);
      AnimateElement(sideMenu, { width: (windowWidth * 0.8435) + 'px' }, { width: "0px" }, 175).addEventListener('finish', () => {
        DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.HIDDEN);
      });
      ResetTouchInfoData(touchInfo);
    }
  }
}
