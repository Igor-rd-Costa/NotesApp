import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListHeader } from './NotesListHeader/NotesListHeader.component';
import { NotesListMain } from './NotesListMain/NotesListMain.component';
import { SideMenu } from './SideMenu/SideMenu.component';
import { DisplayModeService } from 'src/app/Services/DisplayModeService';

@Component({
  selector: 'NotesList',
  standalone: true,
  imports: [CommonModule, NotesListHeader, NotesListMain, SideMenu ],
  templateUrl: './NotesList.component.html',
  styleUrls: ['./NotesList.component.css']
})
export class NotesList {

  OnClick(event : MouseEvent) { 
    if (DisplayModeService.IsSideMenuVisible() && (event.target as HTMLElement).closest("sidemenu") === null)
        DisplayModeService.NotesListDisplayMode.HideSideMenu();
  }
}
