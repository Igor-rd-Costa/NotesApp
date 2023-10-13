import { Component, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDisplayMode, DisplayModeService, HeaderDisplayMode } from 'src/app/Services/DisplayModeService';
import { NgStyle } from '@angular/common';
import { NotesService } from 'src/app/Services/NotesService';

@Component({
  standalone: true,
  selector: 'NotesDisplayHeader',
  templateUrl: './NotesDisplayHeader.component.html',
  providers: [ HttpClient ],
  imports: [ NgStyle ],
  styleUrls: ['./NotesDisplayHeader.component.css']
})

export class NotesDisplayHeader {
  folderName: string = "All Notes";
  noteCount : number = 0;
  style : string = "";
  folderNameOpacity : string = "";
  folderNameSmallOpacity : string = "";
  constructor(notesService : NotesService) {
    effect(() => {
      if (DisplayModeService.GetAppDisplayMode() === AppDisplayMode.NOTE_LIST) {
        let displayMode: HeaderDisplayMode = DisplayModeService.GetHeaderDisplayMode();
        if (displayMode === HeaderDisplayMode.HEADER_LARGE) {
          this.style = '';
          this.folderNameOpacity = '';
          this.folderNameSmallOpacity = '';
        }
        else if (displayMode === HeaderDisplayMode.HEADER_HIDDEN) {
          this.style = '1vh';
          this.folderNameOpacity = '0';
          this.folderNameSmallOpacity = '1';
        }
      }
    })
    notesService.GetNoteCount().then(result => { this.noteCount = result; });
  }
}
