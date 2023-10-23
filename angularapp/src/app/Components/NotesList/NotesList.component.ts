import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListHeader } from './NotesListHeader/NotesListHeader.component';
import { NotesListMain } from './NotesListMain/NotesListMain.component';
import { SideMenu } from './SideMenu/SideMenu.component';
import { DisplayModeService, SideMenuDisplayMode } from 'src/app/Services/DisplayModeService';
import { NotesService } from 'src/app/Services/NotesService';

@Component({
  selector: 'NotesList',
  standalone: true,
  imports: [CommonModule, NotesListHeader, NotesListMain, SideMenu ],
  templateUrl: './NotesList.component.html',
  styleUrls: ['./NotesList.component.css']
})
export class NotesList {

  private static noteCount = signal<number>(0);

  constructor(private notesService : NotesService) {
    this.notesService.GetNoteCount().subscribe(count => NotesList.noteCount.set(count));
  }

  OnClick(event : MouseEvent) : void { 
    if (DisplayModeService.GetSideMenuDisplayMode() === SideMenuDisplayMode.VISIBLE) {
      if ((event.target as HTMLElement).closest("#profile-menu") === null && SideMenu.isProfileMenuVisible) {
        SideMenu.HideProfileMenu();
      }

      if ((event.target as HTMLElement).closest("sidemenu") === null)
        DisplayModeService.NotesListDisplayMode.HideSideMenu();
    }
  }

  public static GetNoteCount() : number {
    return NotesList.noteCount();
  }
}
