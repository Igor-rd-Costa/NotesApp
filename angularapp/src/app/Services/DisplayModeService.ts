import { signal } from "@angular/core";
import AnimateElement from "../Utils/Animate";
import { ResetTouchInfoData, touchInfo } from "../Utils/GlobalEventHandlers";

export enum AppDisplayMode {
  NOTE_LIST, NOTE_DISPLAY
}

export enum HeaderDisplayMode {
  HEADER_LARGE, HEADER_HIDDEN
}

export enum NoteDisplayMode {
  DISPLAY, EDIT
}

export class DisplayModeService 
{
  private static headerDisplayMode = signal<HeaderDisplayMode>(HeaderDisplayMode.HEADER_LARGE);
  private static appDisplayMode = signal<AppDisplayMode>(AppDisplayMode.NOTE_LIST);
  private static noteDisplayMode = signal<NoteDisplayMode>(NoteDisplayMode.DISPLAY);

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

  public static IsSideMenuVisible() : boolean {
    return DisplayModeService.isSideMenuVisible;
  }

  private static isSideMenuVisible : boolean = false; 
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
      AnimateElement(wrapper, { backgroundColor: "white" }, { backgroundColor: "rgb(207, 207, 207)" }, 175);
      AnimateElement(sideMenu, { width: "0px" }, { width: (windowWidth * 0.8435) + 'px' }, 175).addEventListener('finish', () => {
        this.isSideMenuVisible = true;
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
      AnimateElement(wrapper, { backgroundColor: "rgb(207, 207, 207)" }, { backgroundColor: "white" }, 175);
      AnimateElement(sideMenu, { width: (windowWidth * 0.8435) + 'px' }, { width: "0px" }, 175).addEventListener('finish', () => {
        this.isSideMenuVisible = false;
      });
      ResetTouchInfoData(touchInfo);
    }
  }
}
