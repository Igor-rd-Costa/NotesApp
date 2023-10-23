import { Component, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DisplayModeService, HeaderDisplayMode } from 'src/app/Services/DisplayModeService';
import { NgStyle } from '@angular/common';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';
import { NotesList } from '../NotesList.component';
@Component({
  standalone: true,
  selector: 'NotesListHeader',
  providers: [ HttpClient ],
  imports: [ NgStyle, ImgButton ],
  templateUrl: './NotesListHeader.component.html',
  styleUrls: ['./NotesListHeader.component.css']
})

export class NotesListHeader {
  folderName: string = "All Notes";
  noteCount : number = 0;
  style : string = "";
  folderNameOpacity : string = "";
  folderNameSmallOpacity : string = "";
  constructor() {
    effect(() => {
        let displayMode: HeaderDisplayMode = DisplayModeService.GetHeaderDisplayMode();
        this.noteCount = NotesList.GetNoteCount();
        if (displayMode === HeaderDisplayMode.HEADER_LARGE) {
          this.style = '';
          this.folderNameOpacity = '';
          this.folderNameSmallOpacity = '';
        }
        else {
          this.style = '1vh';
          this.folderNameOpacity = '0';
          this.folderNameSmallOpacity = '1';
        }
    });
  }

  menuButtonProps : ImgButtonProp = {
    Button: {
      OnClick: this.MenuButtonOnClick
    },
    Img: {
      Src: '/assets/MenuIcon.svg',
      Alt: "Menu"
    }
  }

  MenuButtonOnClick(event : MouseEvent) {
      DisplayModeService.NotesListDisplayMode.ShowSideMenu();
      
  }
}
