import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './Page/Page.component';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';
import { NotesService } from 'src/app/Services/NotesService';

@Component({
  selector: 'NoteDisplayMain',
  standalone: true,
  imports: [CommonModule, Page, ImgButton ],
  templateUrl: './NoteDisplayMain.component.html',
  styleUrls: ['./NoteDisplayMain.component.css']
})
export class NoteDisplayMain {
  constructor(private notesService : NotesService) {}
  @Input() noteId : string = "";
  @Input() noteContent : string = "";

  undoButtonProps : ImgButtonProp = {
    Button: {
      OnClick: this.UndoButtonOnClick
    },
    Img: {
      Src: '/assets/UndoIcon.svg',
      Alt: 'Undo icon'
    }
  }


  UndoButtonOnClick(event : MouseEvent) {
  }

  SaveContentChanges() {
    let pages = document.getElementsByClassName("note-page");
    if (pages.length === 0)
      return;
    
    let content = "";
    for (let i = 0; i < pages.length; i++) {
      let page = pages.item(i) as HTMLElement;
      if (page != null) {
        content += page.innerText;
      }
    }
    console.log("Content: ", content);
    this.notesService.Update(this.noteId, content).subscribe();
  }
}
