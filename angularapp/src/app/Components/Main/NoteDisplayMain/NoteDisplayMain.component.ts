import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from './Page/Page.component';
import { ImgButton, ImgButtonProp } from '../../General/ImgButton/ImgButton.component';

@Component({
  selector: 'NoteDisplayMain',
  standalone: true,
  imports: [CommonModule, Page, ImgButton ],
  templateUrl: './NoteDisplayMain.component.html',
  styleUrls: ['./NoteDisplayMain.component.css']
})
export class NoteDisplayMain {
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
}
