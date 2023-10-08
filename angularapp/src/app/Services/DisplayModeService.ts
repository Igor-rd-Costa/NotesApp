import { signal } from "@angular/core";

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

}
