import { signal } from "@angular/core";
import AnimateElement from "../Utils/Animate";
import { ResetTouchInfoData, touchInfo } from "../Utils/GlobalEventHandlers";

export enum AppDisplayMode {
  INDEX_DISPLAY, NOTE_LIST, NOTE_DISPLAY
}

export enum HeaderDisplayMode {
  HEADER_LARGE, HEADER_HIDDEN
}

export enum NoteDisplayMode {
  DISPLAY, EDIT
}


export enum IndexDisplayMode {
  LOGIN, REGISTER
}

export enum SideMenuDisplayMode {
  HIDDEN, VISIBLE
}

export class DisplayModeService 
{
  private static headerDisplayMode = signal<HeaderDisplayMode>(HeaderDisplayMode.HEADER_LARGE);
  private static appDisplayMode = signal<AppDisplayMode>(AppDisplayMode.INDEX_DISPLAY);
  private static noteDisplayMode = signal<NoteDisplayMode>(NoteDisplayMode.DISPLAY);
  private static indexDisplayMode = signal<IndexDisplayMode>(IndexDisplayMode.LOGIN);
  private static sideMenuDisplayMode = signal<SideMenuDisplayMode>(SideMenuDisplayMode.HIDDEN);

  public static SetAppDisplayMode(mode: AppDisplayMode) : void {
    DisplayModeService.appDisplayMode.set(mode);
  }
  
  public static GetAppDisplayMode(): AppDisplayMode {
    return DisplayModeService.appDisplayMode();
  }

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

  public static SetIndexDisplayMode(mode : IndexDisplayMode) : void {
    DisplayModeService.indexDisplayMode.set(mode);
  }

  public static GetIndexDisplayMode() : IndexDisplayMode {
    return DisplayModeService.indexDisplayMode();
  }

  public static GetSideMenuDisplayMode() : SideMenuDisplayMode {
    return DisplayModeService.sideMenuDisplayMode();
  }

  public static SetSideMenuDisplayMode(mode : SideMenuDisplayMode) : void {
    DisplayModeService.sideMenuDisplayMode.set(mode);
  }

  public static NotesListDisplayMode = {
    ShowSideMenu: () => {
      if (DisplayModeService.GetAppDisplayMode() != AppDisplayMode.NOTE_LIST)
        return;

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
      AnimateElement(wrapper, { backgroundColor: "#333333" }, { backgroundColor: "#222222" }, 175);
      AnimateElement(sideMenu, { width: "0px" }, { width: (windowWidth * 0.8435) + 'px' }, 175).addEventListener('finish', () => {
        DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.VISIBLE);
      });
    },
    HideSideMenu: () => {
      if (DisplayModeService.GetAppDisplayMode() != AppDisplayMode.NOTE_LIST)
        return;
    
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
      AnimateElement(wrapper, { backgroundColor: "#222222" }, { backgroundColor: "#333333" }, 175);
      AnimateElement(sideMenu, { width: (windowWidth * 0.8435) + 'px' }, { width: "0px" }, 175).addEventListener('finish', () => {
        DisplayModeService.SetSideMenuDisplayMode(SideMenuDisplayMode.HIDDEN);
      });
      ResetTouchInfoData(touchInfo);
    }
  }
}
